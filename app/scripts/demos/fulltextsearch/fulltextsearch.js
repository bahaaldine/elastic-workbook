(function () {
'use strict';

angular.module('workbook.demos.fulltextsearch', [])
.controller('fullTextSearchCtrl', ['$scope', 'ESClient', '$parse', '$timeout', '$q', '$log',
  function ($scope, ESClient, $parse, $timeout, $q, $log) {
    var self = this;
    var deferred;
    self.querySearch   = querySearch;
    $scope.vOneBoost = 1;
    $scope.vTwoBoost = 1;

    $scope.$watch('vOneBoost', function(boost){
      if ( angular.isDefined( $scope.request ) ) {
        $scope.request.body.query.bool.should[1].match["Vehicle 1 description"].boost = boost;
        querySearch($scope.request.body.query.bool.should[1].match["Vehicle 1 description"].query);
      }
    });

    $scope.$watch('vTwoBoost', function(boost){
      if ( angular.isDefined( $scope.request ) ) {
        $scope.request.body.query.bool.should[0].match["Vehicle 2 Description"].boost = boost;
        querySearch($scope.request.body.query.bool.should[0].match["Vehicle 2 Description"].query);
      }
    });

    function querySearch (query) {
      deferred = $q.defer();

      $scope.esClient = new ESClient(10, 0);
	  	$scope.request = {
			  index: 'accident*',
			  type: 'accident',
			  body: {
			  	from: $scope.from,
			  	size: $scope.pageSize,
			  	fields: ["Vehicle 1 description", "Vehicle 2 Description", "Address1", "fullAddress", "timestamp"], 
				  query: {
            bool: {
              should: [
                {
                  match: {
                    "Vehicle 2 Description": {
                      query: query,
                      boost: $scope.vTwoBoost
                    }
                  }
                },
                {
                  match: { 
                    "Vehicle 1 description": {
                      query: query,
                      boost: $scope.vOneBoost 
                    }
                  }
                }
              ]
            }
          }
			  }
			};

			$scope.esClient.nextPage($scope.request).then(function(client){
				deferred.resolve( client.response.map( function (hit) {
	      	return {
						value: hit.fields.Address1[0],
					  display: hit.fields["Vehicle 1 description"][0] + " & " + hit.fields["Vehicle 2 Description"][0] + " - " + hit.fields.Address1[0]
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