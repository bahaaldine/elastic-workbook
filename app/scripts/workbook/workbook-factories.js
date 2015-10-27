'use strict';

angular.module('workbook.factories', [])
.service('WorkbookService', ['$parse', 'ESClient', '$location',
    function ($parse, ESClient, $location) {
	
  var esClient = new ESClient(10, 0);

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

  var getResultURL = function(result) {
    
    // check here if the result is related 
    // to one or more indices and join the array
    // into comma separated value
    var indices = result._index ;
    if ( result._index instanceof Array ) {
      indices = result._index.join();
    }
    var URL = $location.$$protocol+"://"+$location.$$host+":"+$location.$$port+"/#/result?id="+result._id+"&type="+result._type+"&idx="+indices;

    return URL;
  }

	return {
		toPrettyJSON: toPrettyJSON,
    toSummary: toSummary,
    getResultURL: getResultURL
	}
}]);