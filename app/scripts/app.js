(function() {
	var app = angular.module('app', []);

	app.controller('mainController', ['$scope', function($scope) {
		$scope.message = "Thomas Cruise Mapother IV (born July 3, 1962), known professionally as Tom Cruise, is an American actor and producer. ";
		chrome.tabs.captureVisibleTab( 
	        chrome.windows.WINDOW_ID_CURRENT,
	        function (src) {
	          // displays a link to the image. Can be replaced by an alert() to 
	          // verify the result is 'undefined'
	          console.log(src);
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
	}]);
	
	
})();