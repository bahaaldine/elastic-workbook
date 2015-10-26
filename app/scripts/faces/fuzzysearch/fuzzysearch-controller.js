(function () {
'use strict';

angular.module('workbook.faces.fuzzysearch.controllers', [])
.controller('fuzzySearchCtrl', ['$scope', 'ESClient', '$parse', '$timeout', '$q', '$log',
  function ($scope, ESClient, $parse, $timeout, $q, $log) {
    var self = this;
    var component = $scope.component;

    self.querySearch = querySearch;
    self.component = component;
    self.getComponentResultTitle = getComponentResultTitle;
    self.getComponentResultDescription = getComponentResultDescription;

    $scope.esClient = new ESClient(component.paging.pageSize, component.paging.from);

    function querySearch (query) {      
      var deferred = $q.defer();

      $scope.esClient = new ESClient(component.paging.pageSize, component.paging.from);
	  	$scope.request = {
			  index: component.index, 
			  type: component.documentType,
			  body: {
          from: component.paging.from,
          size: component.paging.pageSize,
          fields: component.fields.map(function(field) {
            return field.name;
          }),
          query: {
            match: buildMathQuery(component.typeAheadValue, query)
          }
        }
			};

			$scope.esClient.nextPage($scope.request).then( function(client) {
				deferred.resolve( client.response.map( function (hit) {
          return {
            value: hit.fields[component.itemTitle][0],
            display: hit.fields[component.itemTitle][0]
          };
	      }));
			});

      return deferred.promise;
    }

    function getComponentResultTitle(index) {
      // TODO: should not be necessary  
      if ( angular.isDefined($scope.esClient.response[index].fields[component.itemTitle]) ) {
        return $scope.esClient.response[index].fields[component.itemTitle][0];
      }
    }

    function getComponentResultDescription(index) {
      // TODO: should not be necessary  
      if ( angular.isDefined($scope.esClient.response[index].fields[component.itemDescription]) ) {
        return $scope.esClient.response[index].fields[component.itemDescription][0];
      }
    }

    function buildMathQuery(key, query) {
      var jsonObject = {}
      jsonObject[key] = {
        query: query,
        fuzziness: "AUTO",
        operator: "and"
      }
      return jsonObject;
    }


    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
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