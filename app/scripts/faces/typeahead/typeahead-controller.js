(function () {
'use strict';

angular.module('workbook.faces.typeahead.controllers', [])
.controller('typeaheadCtrl', ['$scope', 'ESClient', '$parse', '$q', 'WorkbookService',
  function ($scope, ESClient, $parse, $q, WorkbookService) {
    var self = this;
    var component = $scope.component;

    self.querySearch = querySearch;
    self.component = component;

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
          fields: [component.searchInput, "_source"],
          query: {
            match_phrase_prefix: buildMathPhraseQuery(component.searchInput, query)
          }
        }
			};

			$scope.esClient.nextPage($scope.request).then( function(client) {
				deferred.resolve( client.response.map( function (hit) {
          return {
            value: hit.fields[component.searchInput][0],
            display: hit.fields[component.searchInput][0]
          };
	      }));
			});

      return deferred.promise;
    }

    function buildMathPhraseQuery(key, query) {
      var jsonObject = {}
      jsonObject[key] = {
        query: query
      }
      return jsonObject;
    }
	}])
})();