var express = require("express");
var querystring = require('querystring');
var multer = require('multer');
var http = require('http');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
var bodyParser = require('body-parser');
var suspend = require('suspend'),
	resume = suspend.resume;
var rp = require('request-promise');
app.use(bodyParser.json({
	limit: '50mb'
}));
app.use(bodyParser.urlencoded({
	limit: '50mb',
	extended: true
}));
var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './uploads');
	},
	filename: function(req, file, callback) {
		callback(null, file.fieldname + '-' + Date.now());
	}
});

app.get('/', function(req, res) {
	res.sendFile(__dirname + "/index.html");
});

function decodeBase64Image(dataString) {
	var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
	var response = {};
	if (matches.length !== 3) {
		return new Error('Invalid input string');
	}
	response.type = matches[1];
	response.data = new Buffer(matches[2], 'base64');
	return response;
}
var upload = multer(); // for parsing multipart/form-data
app.post('/testFormData', upload.array(), function(req, res) {
	var base64Data = decodeBase64Image(req.body.testdot);
	//console.log('writing file...', base64Data);
	var filename = Date.now() + ".jpg";
	fs.writeFile(__dirname + "/uploads/" + filename, base64Data.data, function(err) {
		if (err) {
			console.log(err);
			res.send({
				"success": false,
				"error": err
			});
		}
		fs.readFile(__dirname + "/uploads/" + filename, function(err, data) {
			if (err) {
				res.send({
					"success": false,
					"error": err
				});
			}
			console.log('reading file...', filename);
			var mData = {
				'url': 'http://nisarg.me:3000/uploads/' + filename
			};
			var options = {
				url: 'https://api.projectoxford.ai/vision/v1.0/analyze?details=Celebrities',
				headers: {
					'Content-Type': 'application/json',
					'Ocp-Apim-Subscription-Key': '92c7f770b37a4349ac0bb04120a1672b'
				},
				body: JSON.stringify(mData)
			};
			request.post(options, function(error, response, body) {
				if (error) console.log(error);
				else {
					console.log(body);
					var data = JSON.parse(body);
					if (typeof data.categories[0].detail != 'undefined') {
						var celebs = data.categories[0].detail.celebrities;
						var celebData = [];
						for (var i = 0; i < celebs.length; i++) {
							console.log("in loop" + celebs[i].name);
							cBody = {
								"name": celebs[i].name
							};
							var name = celebs[i].name;
							var firstName = "",
								secondName = "",
								flag = 0;
							for (var i = 0; i < name.length; i++) {
								if (name.charAt(i) == ' ') {
									flag = 1;
								} else if (flag == 0) firstName += name.charAt(i);
								else if (flag == 1) {
									secondName += name.charAt(i);
								}
							}
							var url = 'https://simple.wikipedia.org/wiki/' + firstName + '_' + secondName;
							rp(url).then(function(html) {
								var $ = cheerio.load(html);
								var intro, table, image;
								var json = {
									intro: "",
									table: "",
									image: "",
									name: "",
									url: ""
								};
								// We'll use the unique header class as a starting point.
								$('.mw-content-ltr').filter(function() {
									// Let's store the data we filter into a variable so we can easily see what's going on.
									var data = $(this);
									intro = $('p').eq(0).text();
									//intro = data.children().second().text();
									json.intro = intro;
								})
								$('.mw-content-ltr').filter(function() {
									var data = $(this);
									image = "https:" + $('img').eq(0).attr("src");
									table = $('table').eq(0).toString();
									json.name = name;
									json.image = image;
									json.table = table;
									json.url = url;
								})
								console.log(json);
								res.send(json);
								celebData.push(json);
							}).
							catch (function(err) {
								console.log("error " + err);
							});
						}
						console.log(celebData);

					} else{
						res.status(400).send("Bad request");
					}
					//res.send(celebData);
				}
			})
			//res.send({"success":true, "filename":filename});
		});
	});
});

app.post('/api/', function(req, res) {
	res.json(req.body);
});

app.use('/uploads', express.static('uploads'));

app.listen(3000, function() {
	console.log("Working on port 3000");
});