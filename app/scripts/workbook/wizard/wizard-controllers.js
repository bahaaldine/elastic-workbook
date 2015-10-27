(function(){
  'use strict';
/**
 * @ngdoc function
 * @name workbookApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workbookApp
 */
angular.module('workbook.wizard.controllers', [])
.controller('wizardCtrl', ['$scope', 'ESClient', '$q', '$mdToast', '$location', '$window',
  function ($scope, ESClient, $q, $mdToast, $location, $window) {

    var workflows = {
      text: ['wizardDefineFace', 'wizardIndices', 'wizardSearchInput', 'wizardLayout'],
      map: ['wizardDefineFace', 'wizardIndices', 'wizardSearchInput', 'wizardLayout']
    };
    var self = this;

    $scope.wizard = {
      indices : {
        available: [],
        isSelected: [],
        added: []
      },
      fields: {
        available: [],
        input: {
          selected: []
        },
        output: {
          selected: []
        }
      },
      show: {
        documentationLink: true,
        description: true,
        request: true,
        response: true
      },
      pageSize: 20,
      step: 'wizardDefineFace',
      faces: {
        available: [
          {searchType: 'text', type: 'fuzzysearch', name: 'Fuzzy search', icon:'search', background: ''},
          {searchType: 'text', type: 'fulltextsearch', name: 'Full text search',icon:'search', background: ''},
          {searchType: 'text', type: 'typeahead', name: 'Type ahead',icon:'search', background: ''},
          {searchType: 'map', type: 'geoshapes', name: 'Geo shapes',icon:'place', background: ''},
          {searchType: 'map', type: 'dragthemap', name: 'Drag the map',icon:'place', background: ''}
        ]
      }
    };

    if ( angular.isDefined($location.$$search.type) 
      &&  angular.isDefined($location.$$search.id) ) {
      
      var request = {
        index: '.faces', 
        type: $location.$$search.type,
        id: $location.$$search.id
      };

      $scope.esClient = new ESClient();
      $scope.esClient.getFace(request).then( function(client) {
        
        $scope.wizard.component = client.response._source;
        $scope.wizard.name = $scope.wizard.component.name;
        $scope.wizard.indices = {
          added: $scope.wizard.component.index,
          isSelected: []
        }
        angular.forEach($scope.wizard.component.index, function(index, key) {
          $scope.wizard.indices.isSelected[index] = true;
        });

        $scope.wizard.faces.selected = $scope.wizard.component.type.type;
        $scope.wizard.fields.input.selected = $scope.wizard.component.typeAheadValue;
        $scope.wizard.pageSize = $scope.wizard.component.paging.pageSize;
        
        $scope.wizard.fields.output.added = $scope.wizard.component.fields;
        $scope.wizard.fields.output.added[0].name = $scope.wizard.component.itemTitle;
        angular.forEach($scope.wizard.fields.output.added, function(value){
          $scope.wizard.fields.output.isSelected[value.dot_path] = true;
        });
      

        $scope.wizard.show = $scope.wizard.component.show;

      });
    }


    $scope.esClient = new ESClient();  
    $scope.esClient.getIndices({ index: "*" }).then(function(client) {
      $scope.wizard.indices.available = client.response;
    });

    var getStep = function(step) {
      var faceType = $scope.wizard.faces.available.filter( function(face) {
        return face.type == $scope.wizard.faces.selected;
      });

      var workflow = workflows[faceType[0].searchType];
      $scope.wizard.step = workflow[workflow.indexOf($scope.wizard.step) + step];
    }

    $scope.nextStep = function() {
      $scope.wizard.validateStep().then( function(valid) {
        getStep(+1);       
      }, function(notValid) {
        console.info($scope.wizard.step + ' invalid');
      });
    }

    $scope.previousStep = function() {
      if ( angular.isUndefined($scope.wizard.faces.selected) ) {
        return false;
      }
      getStep(-1);
    }

    $scope.isFinalStep = function() {
      if ( angular.isUndefined($scope.wizard.faces.selected) ) {
        return false;
      }

      var faceType = $scope.wizard.faces.available.filter( function(face) {
        return face.type == $scope.wizard.faces.selected;
      });

      if ( angular.isUndefined(faceType) && faceType.length > 0 ) {
        return false;
      }

      var workflow = workflows[faceType[0].searchType];
      return workflow.indexOf($scope.wizard.step) >= workflow.length-1 ;
    }

    $scope.toggleIndex = function(index) {
      if ( $scope.wizard.indices.isSelected[index] ) {
        $scope.wizard.indices.added.push(index);
      } else {
        $scope.wizard.indices.added.pop(index);
      }
    }

    $scope.toggleField = function(field) {
      if ( $scope.wizard.fields.output.isSelected[field.dot_path] ) {
        $scope.wizard.fields.output.added.push(field);
      } else {
        $scope.wizard.fields.output.added.pop(field);
      }
    }

    $scope.save = function() {

      var faceType = $scope.wizard.faces.available.filter( function(face) {
        return face.type == $scope.wizard.faces.selected;
      });

      var searchInput = $scope.wizard.fields.available.filter( function(input) {
        return input.dot_path == $scope.wizard.fields.input.selected;
      });

      console.log(searchInput)

      $scope.wizard.component = {
        name: $scope.wizard.name,
        faceType: faceType[0],
        index: $scope.wizard.indices.added,
        documentType: searchInput[0].documentType,
        searchInput: $scope.wizard.fields.input.selected,
        show: $scope.wizard.show,
        paging: {
          from: 0,
          pageSize: $scope.wizard.pageSize
        },
        componentDescription: "<h3>Description</h3><br />This demos showcases the fuzzysearch query feature of Elasticsearch.<br />Start <b>typing an address</b> to trigger the search !",
        documentationLink: "https://www.elastic.co/guide/en/elasticsearch/guide/current/fuzzy-match-query.html#fuzzy-match-query",
      };

      $scope.esClient.index($scope.wizard.component).then(function(client) {
        $location.path('/#/face/'+faceType[0].searchType);
        $window.open('/#/feature?type='+faceType[0].type+'&face='+client.resp._id);
      }, function(err){
        $scope.showAlert("Error occured while creating Face: <br >" + JSON.stringify(err));
      });
    }

    $scope.showAlert = function(message) {
      $mdToast.show({
        content: message,
        template: '<md-toast class="md-error-toast-theme" ng-bind-html="\'' + message + '\'"></md-toast>',
        position: "top right",
        hideDelay: 3000
      });
    };

  }]);
})();