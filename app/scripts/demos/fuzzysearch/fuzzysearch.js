(function () {
'use strict';

angular.module('workbook.demos.fuzzysearch', [])
.controller('fuzzySearchCtrl', ['$scope', 'ESClient', '$parse', '$timeout', '$q', '$log',
  function ($scope, ESClient, $parse, $timeout, $q, $log) {
    var self = this;
    var deferred;
    self.querySearch   = querySearch;
    self.selectedItemChange  = selectedItemChange;

    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
    }

    function querySearch (query) {      
      deferred = $q.defer();

      $scope.esClient = new ESClient(10, 0);
	  	$scope.request = {
			  index: 'accident*',
			  type: 'accident',
			  body: {
			  	from: $scope.from,
			  	size: $scope.pageSize,
			  	fields: ["Vehicle 1 description", "Vehicle 2 description", "Address1", "fullAddress", "timestamp"], 
				  query: {
            match: {
              "Address1.untouched": {
                query: query,
                fuzziness: "AUTO",
                operator: "and"
              }
            }
          }
			  }
			};

			$scope.esClient.nextPage($scope.request).then(function(client){
				deferred.resolve( client.response.map( function (hit) {
	      	return {
						value: hit.fields.Address1[0],
					  display: hit.fields["Vehicle 1 description"][0] + " - " + hit.fields.Address1[0]
		      };
	      }));
			});

      return deferred.promise;
    }

    var _lastGoodResult = '';
    $scope.toPrettyJSON = function (json, tabWidth) {
      var objStr = JSON.stringify(json);
      var obj = null;
      try {
        obj = $parse(objStr)({});
      } catch(e){
        // eat $parse error
        return _lastGoodResult;
      }

      var result = JSON.stringify(obj, null, Number(tabWidth));
      _lastGoodResult = result;

      return result;
    };
	}])
})();