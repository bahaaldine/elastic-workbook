(function () {
'use strict';

angular.module('workbook.faces.controllers', [])
.controller('facesCtrl', ['$scope', 'ESClient', '$location', '$state',
  function ($scope, ESClient, $location, $state) {
    var self = this;
    
    if ( angular.isDefined($location.$$search.type) 
    	&&  angular.isDefined($location.$$search.id) ) {
    	
		var request = {
		  index: '.faces', 
		  type: $location.$$search.type,
		  id: $location.$$search.id
		};

		$scope.esClient = new ESClient();
    	$scope.esClient.getFace(request).then( function(client) {
    		$scope.component = client.response._source;
    	});
    }
	}])
})();