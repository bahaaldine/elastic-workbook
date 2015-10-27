(function(){
  'use strict';
/**
 * @ngdoc function
 * @name workbook.result.controllers:resultCtrl
 * @description
 * # resultCtrl
 * Controller of the workbookApp
 */
angular.module('workbook.result.controllers', [])
.controller('resultCtrl', ['$scope', 'ESClient', '$location',
  function ($scope, ESClient, $location) {

    var self = this;

    if ( angular.isDefined($location.$$search.type) 
      &&  angular.isDefined($location.$$search.id)
        &&  angular.isDefined($location.$$search.idx) ) {
      
    var index = $location.$$search.idx;
    if ( index.indexOf(',') > -1 ) {
      index = $location.$$search.idx.split(',');
    }

    var request = {
      index: index, 
      type: $location.$$search.type,
      id: $location.$$search.id
    };

    $scope.esClient = new ESClient();
      $scope.esClient.getResult(request).then( function(client) {
        $scope.jsonResult = JSON.stringify(client.response._source);
      }, function(err){
        console.log(err)
      });
    }

  }]);
})();