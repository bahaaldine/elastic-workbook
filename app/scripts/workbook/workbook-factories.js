'use strict';

angular.module('workbook.factories', [])
.service('WorkbookService', ['$parse', function ($parse) {
	
  var toPrettyJSON = function (json, tabWidth) {
  	var _lastGoodResult = '';
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

  var toSummary = function (json) {
    var summary = "";

    angular.forEach(json, function(value, key){
      summary += " &bull; " + value + ": " + key;
    });

    return summary.substring(0, 300) + '...' ;
  }

	return {
		toPrettyJSON: toPrettyJSON,
    toSummary: toSummary
	}
}]);