(function(){
  'use strict';
/**
 * @ngdoc function
 * @name workbookApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workbookApp
 */
angular.module('workbook.home.controllers', [])
.controller('homeCtrl', ['$scope', 'ESClient', '$window', '$location',
  function ($scope, ESClient, $window, $location) {
    var facesIndexName = ".faces";

    var self = this;
    self.openFace = openFace;
    self.removeFace = removeFace;

    $scope.esClient = new ESClient();      
    $scope.esClient.getFaces().then(function(client) {
      $scope.faces = client.resp;
    });

    function openFace(face) {
    	$window.open('/#/face?type='+face._type+'&id='+face._id);
    }

    function removeFace(face) {
    	var request = {
			  index: facesIndexName, 
			  type: face._type,
			  body: {          
					query : {
						term : { _id : face._id }
					}
        }
			};
    	$scope.esClient.deleteFace(request);
    }

    function editFace(face) {
      $location.path('/#/wizard?type='+face._type+'&id='+face._id);
    }
  }]);
})();