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
    self.editFace = editFace;

    $scope.esClient = new ESClient();      
    $scope.esClient.getFaces().then(function(client) {
      var faces = client.response;
      
      angular.forEach(client.response, function(face, index) {
        var request = {index: face._source.index};
        $scope.esClient.getFaceDocumentCount(request).then(function(countClient){
          faces[index].count = countClient.response.count;
        });
      })

      $scope.faces = faces;
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
      $location.path('wizard').search({type: face._type, id: face._id});
    }
  }]);
})();