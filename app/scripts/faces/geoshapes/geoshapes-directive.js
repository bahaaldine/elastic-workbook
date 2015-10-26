(function () {
'use strict';

angular.module('workbook.faces.geoshapes.directives', [])
.directive('geoshapes', ['ESClient', '$parse', function(ESClient, $parse) {
	return {
		restrict: 'EA',
		replace: true,
		link: function (scope, elm, attrs) {
			scope.deleteSelectedShape = function() {
			  scope.selectedShape.setMap(null);
			  scope.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
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

			var mapOptions = {
				zoom:12,
				center:{lat: 48.8567, lng: 2.3508},
				mapTypeId:google.maps.MapTypeId.ROADMAP,
				zoomControl:0,
				mapTypeControl:0,
				scaleControl:0,
				streetViewControl:0,
				panControl:0
			};

		  scope.map = new google.maps.Map(elm[0], mapOptions);

		  scope.drawingManager = new google.maps.drawing.DrawingManager({
		    drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: false,
        polygonOptions: {
          editable: true,
          strokeColor: "#39bdb1",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#39bdb1",
          fillOpacity: 0.35
        }
		  });
		  scope.drawingManager.setMap(scope.map);
		  scope.drawingManager.addListener('polygoncomplete', scope.handlePolygon);

		  google.maps.event.addListener(scope.map, 'click', scope.deleteSelectedShape);
		}
	}
}]);
})();