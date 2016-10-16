(function() {
	var app = angular.module('app', []);

	app.controller('mainController', ['$scope','$http', function($scope,$http) {
		$scope.message = "Thomas Cruise Mapother IV (born July 3, 1962), known professionally as Tom Cruise, is an American actor and producer. ";
		chrome.tabs.captureVisibleTab( 
	        chrome.windows.WINDOW_ID_CURRENT,
	        function (src) {
	          // displays a link to the image. Can be replaced by an alert() to 
	          // verify the result is 'undefined'
	          console.log(src);
	          upload(src);
	        }
	    );
		/*
		chrome.tabs.query( {
	      // gets the window the user can currently see
	      active: true, 
	      currentWindow: true 
	    },
	    function (tabs) {
	      chrome.tabs.captureVisibleTab( 
	        chrome.windows.WINDOW_ID_CURRENT,
	        function (src) {
	          // displays a link to the image. Can be replaced by an alert() to 
	          // verify the result is 'undefined'
	          console.log(src);
	        }
	      ); 
	    }
	  );*/
	  var upload = function(image){
		var body = {"testdot": image};
		$http.post('http://nisarg.me:3000/testFormData/', body).
				success(function(data, status) {
					if (data.success == true) {
						console.log(data.filename);

						var mData = {'url': 'http://nisarg.me:3000/uploads/'+data.filename};
						$http.post('https://api.projectoxford.ai/vision/v1.0/analyze?details=Celebrities', mData, {
					        headers: { 'Content-Type': 'application/json','Ocp-Apim-Subscription-Key': '92c7f770b37a4349ac0bb04120a1672b'},
					    })
					    .success(function(data) {
					        //do stuff with response
					        console.log(data);
					    })
					    .error(function(data, status, headers, config) {
							console.log(data);	
						});
					
					} else {
						console.log(data);
					}
				}).error(function(data, status, headers, config) {
					console.log(data);	
				});
		}
	}]);
	
	
	
})();