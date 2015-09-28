(function () {
'use strict';

angular.module('workbook.demos.fulltextsearch', [])
.directive('fullTextSearch', ['ESClient', '$parse', function(ESClient, $parse) {
	return {
		restrict: 'EA',
		replace: true,
		link: function (scope, elm, attrs) {
		},
		controller: function($scope) {
		}
	}
}]);
})();