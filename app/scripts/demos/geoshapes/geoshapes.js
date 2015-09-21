'use strict';

angular.module('workbook.demos.geoshapes', [])
.directive('polygonMap', ['ESClient', '$parse', function(ESClient, $parse) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'views/demo/geoshapes/index.html',
		link: function (scope, elm, attrs) {
			scope.deleteSelectedShape = function() {
			  scope.selectedShape.setMap(null);
			}

			scope.getPolygonCoordinates = function(polygon) {
			  var vertices = polygon.getPath();
			  var edges = [];
			  for (var i =0; i < vertices.getLength(); i++) {
			    var xy = vertices.getAt(i);
			    edges.push({lat: xy.lat(), lon:xy.lng()})
			  }
			  scope.$apply(function(){
			  	scope.edges = edges;
			  });
			}

			scope.handlePolygon = function(shape) {
			  scope.selectedShape = shape;
			  scope.getPolygonCoordinates(shape)
			  scope.drawingManager.setDrawingMode(null);
			}

		  scope.map = new google.maps.Map(elm[0], {
		    center: {lat: 48.8567, lng: 2.3508},
		    zoom: 12
		  });

		  scope.drawingManager = new google.maps.drawing.DrawingManager({
		    drawingMode: google.maps.drawing.OverlayType.MARKER,
		    drawingControl: true,
		    drawingControlOptions: {
		      position: google.maps.ControlPosition.TOP_CENTER,
		      drawingModes: [
		        google.maps.drawing.OverlayType.POLYGON,
		      ]
		    },
		    polygonOptions: {
		      fillColor: '#2196F3',
		      fillOpacity: 0.2,
		      strokeWeight: 5,
		      strokeColor: '#1565C0',
		      clickable: true,
		      //editable: true,
		      //draggable: true,
		      zIndex: 1
		    }
		  });
		  scope.drawingManager.setMap(scope.map);
		  scope.drawingManager.addListener('polygoncomplete', scope.handlePolygon);

		  google.maps.event.addListener(scope.map, 'click', scope.deleteSelectedShape);
		},
		controller: function($scope) {
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
			  	$scope.geoshapeRequest = {
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

					$scope.esClient.nextPage($scope.geoshapeRequest);
				}
		  }, true);
		}
	}
}]);