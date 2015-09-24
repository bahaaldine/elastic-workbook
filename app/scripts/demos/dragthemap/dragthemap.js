(function () {
'use strict';

angular.module('workbook.demos.dragthemap', [])
.directive('dragTheMap', ['ESClient', '$parse', function(ESClient, $parse) {
	return {
		restrict: 'EA',
		replace: true,
		link: function (scope, elm, attrs) {
		  var mapOptions = {
				zoom:16,
				center:{lat: 48.8567, lng: 2.3508},
				mapTypeId:google.maps.MapTypeId.ROADMAP,
				draggable: true,
				zoomControl:0,
				mapTypeControl:0,
				scaleControl:0,
				streetViewControl:0,
				panControl:0,
				scrollwheel: false,
				disableDoubleClickZoom: true
			};

		  scope.map = new google.maps.Map(elm[0], mapOptions);

		  google.maps.event.addListener(scope.map, 'bounds_changed', function(){
		  	scope.$apply(function(){
			  	scope.bounds = scope.map.getBounds();
			  });
		  });
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

			$scope.$watch("bounds", function(bounds) {
		  	if ( angular.isDefined($scope.bounds) ) {

					$scope.esClient = new ESClient(500, 0);
			  	$scope.request = {
					  index: 'accident*',
					  type: 'accident',
					  body: {
					  	from: $scope.from,
					  	size: $scope.pageSize,
					  	query: {
						    filtered : {
					        filter : {
				            geo_bounding_box : {
			                location : {
			                  top_right : [ $scope.bounds.getNorthEast().lng(), $scope.bounds.getNorthEast().lat() ],
			                  bottom_left: [  $scope.bounds.getSouthWest().lng(), $scope.bounds.getSouthWest().lat()  ]
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

		  $scope.$watch("esClient.response", function(response) {
		  	if ( angular.isDefined(response) && response.length > 0 ) {

		  		if ( angular.isDefined($scope.markers) && $scope.markers.length > 0 ) {
		  			for ( var i=0, l=$scope.markers.length; i<l; i++ ) {
		  				$scope.markers[i].setMap(null);
		  			}
		  		}

		  		$scope.markers = [];
		  		var infowindow = new google.maps.InfoWindow;
		  		for ( var i=0, l=response.length; i<l; i++) {
				    var marker = new google.maps.Marker({
							position: new google.maps.LatLng(response[i]['_source'].location.lat, response[i]['_source'].location.lon),
							map: $scope.map
				    });

				    google.maps.event.addListener(marker, 'click', (function(marker, i) {
							return function() {
								infowindow.setContent(response[i]['_source']['Vehicle 1 description'] + ' - ' + response[i]['_source']['Address1']);
								infowindow.open($scope.map, marker);
							}
				    })(marker, i));

				    $scope.markers.push(marker);
					}
		  	}
		  }, true);
		}
	}
}]);
})();