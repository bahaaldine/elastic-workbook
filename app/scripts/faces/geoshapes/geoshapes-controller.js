(function () {
'use strict';

angular.module('workbook.faces.geoshapes.controllers', [])
.controller('geoshapesCtrl', ['$scope', 'ESClient',
  function ($scope, ESClient) {

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

		$scope.$watch("edges", function(edges) {
	  	if ( angular.isDefined($scope.edges) ) {
				$scope.esClient = new ESClient(10, 0);
		  	$scope.request = {
				  index: 'accident*',
				  type: 'accident',
				  body: {
				  	from: $scope.from,
				  	size: $scope.pageSize,
				  	query: {
					    filtered : {
				        query : {
				          match_all : {}
				        },
				        filter : {
			            geo_polygon : {
			                location : {
			                  points : $scope.edges
			                }
			            }
				        }
				      }
				    }
				  }
				};

				$scope.esClient.nextPage($scope.request);
			}
	  }, true);
	}])
})();