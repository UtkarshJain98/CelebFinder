(function() {
	var app = angular.module('app', []);


	app.factory('mainFactory', function ($http, $q){
		var funcs = {};
	    
	    funcs.getFileUrl = function(body){            
	    	return $http.post('http://nisarg.me:3000/testFormData/', body)
    			.then(function(data, status) {
						console.log(status);
							return data;

							//return funcs.getCelebs(mData);
						    /*.error(function(data, status, headers, config) {
								console.log(data);	
							});*/

				}, function(err){
		            console.error(err);
		            return err;

		        })
		        .catch(function(err){
		            console.error(err);
		            return err; // This will print any error that was thrown in the previous error handler.
		        });
	    			/*.error(function(data, status, headers, config) {
							console.log(data);	
						});*/  
	    }

		

		


	    return funcs;
	});



	app.controller('mainController', ['$scope','$http','mainFactory','$window', function($scope,$http, mainFactory,$window) {
		$scope.isLoading = true;
		$scope.error = false;

		$scope.celebrities = [];
		$scope.celeb = $scope.celebrities[0];
		$scope.message = "Thomas Cruise Mapother IV (born July 3, 1962), known professionally as Tom Cruise, is an American actor and producer. ";
		chrome.tabs.captureVisibleTab( 
	        chrome.windows.WINDOW_ID_CURRENT,
	        function (src) {
	          // displays a link to the image. Can be replaced by an alert() to 
	          // verify the result is 'undefined'
	          var body = {"testdot": src};

	          mainFactory.getFileUrl(body)
			      .then(function(arrItems){
			     	$scope.isLoading = false;

			      	if(arrItems.status=="400"){
			      		$scope.error = true;
			      	} 
			      	else
			         $scope.celebrities = arrItems;
			      	
			       });

	          
			    console.log($scope.celebrities);

	        }
	    );

	    $scope.go_to_item = function(display) {
			 chrome.tabs.create({ url: display });
   			 window.close();
	    };
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
					        console.log(data.categories[0].detail.celebrities);
					        var celebs = data.categories[0].detail.celebrities;
					        for (var i = 0; i < celebs.length; i++){
					        	console.log(celebs[i].name);
					        	cBody = {"name":celebs[i].name};
					        	$http.post('http://nisarg.me:3000/scrape/', cBody)
					        	.success(function(data, status) {
					        		console.log(data);
					        		$scope.celebrities.add(data);
					        	})
					        	.error(function(data, status, headers, config) {
									console.log(data);	
								});
					        }
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