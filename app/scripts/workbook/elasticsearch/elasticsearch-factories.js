'use strict';

angular.module('workbook.elasticsearch.factories', [])
.service('es', [ '$location', 'esFactory', function ($location, esFactory) {

  // TODO: set port dynamically from $location.$$port

  return esFactory({
    host: 'bahaaldine:bazarmi@'+$location.$$host+':9200',
    log: 'warning'
  });
}])
.factory('ESClient', ['$q', 'es', '$filter', function($q, es, $filter) {
  var facesIndexName = ".faces";
  var ESClient = function(pageSize, from) {
    this.pageSize = pageSize;
    this.from = from;
    this.more = true;
    this.indexName = ".faces";
  };

  ESClient.prototype.index = function(document, params) {
    var deferred = $q.defer();
    if ( angular.isDefined(document.index) && document.index.length > 0 ) {

      this.request = {
        index: this.indexName,
        type: document.faceType.type,
        body: document
      }

      if ( !angular.isDefined(this.response) ) {
        this.response = [];
      }

      this.busy = true;
      es.index(this.request).then(function (resp) {
        this.resp = resp;
        if ( angular.isDefined(resp) ) {
          deferred.resolve(this);
        }
        this.busy = false;
      }.bind(this), function (err) {
        deferred.reject(err);
      });
    } else {
      deferred.reject({error: "missing request"});
    }
    return deferred.promise;
  }

  ESClient.prototype.nextPage = function(request) {
    var deferred = $q.defer();
    if ( angular.isDefined(request) ) {

      this.request = request;

      if ( !angular.isDefined(this.response) ) {
        this.response = [];
      }

      if (this.busy || !this.more) {return;}
      this.busy = true;

      if ( angular.isDefined(this.from) ) {
        request.body.from = this.from;
      }

      if ( angular.isDefined(this.pageSize) ) {
        request.body.size = this.pageSize;
      }

      es.search(request).then(function (resp) {
        this.from += resp.hits.hits.length - 1;
        this.more = this.pageSize === resp.hits.hits.length;
        this.response = this.response.concat(resp.hits.hits);
        this.busy = false;
        this.total = resp.hits.total;
        deferred.resolve(this);
      }.bind(this), function (err) {
        console.trace(err.message);
        deferred.reject(err);
      });
    } else {
      deferred.reject({error: "missing request"});
    }

    return deferred.promise;
  };

  ESClient.prototype.getFaces = function(request) {
    var request = { 
      index: facesIndexName,
      body: {
        query: {
          match_all: {}
        }
      }
    };
    return this.nextPage(request);
  };

  ESClient.prototype.getResult = function(request) {
    var deferred = $q.defer();
    if ( angular.isDefined(request.index) && request.index.length > 0 ) {

      this.request = request;

      if ( !angular.isDefined(this.response) ) {
        this.response = {};
      }

      this.busy = true;
      es.get(request).then(function (resp) {
        if ( angular.isDefined(resp) ) {
          this.response = resp;
          deferred.resolve(this);
        }
        this.busy = false;
      }.bind(this), function (err) {
        deferred.reject(err);
      });
    } else {
      deferred.reject({error: "missing request"});
    }
    return deferred.promise;
  };

  ESClient.prototype.getFace = function(request) {
    var deferred = $q.defer();
    if ( angular.isDefined(request.index) && request.index.length > 0 ) {

      this.request = request;

      if ( !angular.isDefined(this.response) ) {
        this.response = {};
      }

      this.busy = true;
      es.get(request).then(function (resp) {
        if ( angular.isDefined(resp) ) {
          this.response = resp;
          deferred.resolve(this);
        }
        this.busy = false;
      }.bind(this), function (err) {
        deferred.reject(err);
      });
    } else {
      deferred.reject({error: "missing request"});
    }
    return deferred.promise;
  };

  ESClient.prototype.getFaceDocumentCount = function(request) {
    var deferred = $q.defer();
    if ( angular.isDefined(request.index) && request.index.length > 0 ) {

      this.request = request;

      if ( !angular.isDefined(this.response) ) {
        this.response = {};
      }

      this.busy = true;
      es.count(request).then(function (resp) {
        if ( angular.isDefined(resp) ) {
          this.response = resp;
          deferred.resolve(this);
        }
        this.busy = false;
      }.bind(this), function (err) {
        deferred.reject(err);
      });
    } else {
      deferred.reject({error: "missing request"});
    }
    return deferred.promise;
  };

  ESClient.prototype.deleteFace = function(request) {
    var deferred = $q.defer();
    if ( angular.isDefined(request.index) && request.index.length > 0 ) {

      this.request = request;

      if ( !angular.isDefined(this.response) ) {
        this.response = [];
      }

      this.busy = true;
      es.deleteByQuery(request).then(function (resp) {
        this.response = resp;
        deferred.resolve(this);
        this.busy = false;
      }.bind(this), function (err) {
        deferred.reject(err);
      });
    } else {
      deferred.reject({error: "missing request"});
    }
    return deferred.promise;
  };

  ESClient.prototype.getIndices = function(request) {
    var deferred = $q.defer();
    if ( angular.isDefined(request.index) && request.index.length > 0 ) {

      this.request = request;

      if ( !angular.isDefined(this.response) ) {
        this.response = [];
      }

      this.busy = true;
      es.indices.get(request).then(function (resp) {
        if ( angular.isDefined(resp) ) {
          var indices = [];
          angular.forEach(resp, function(val, key) {
            indices.push(key);  
          })
          this.response = indices;
          this.total = indices.length;
          deferred.resolve(this);
        }
        this.busy = false;
      }.bind(this), function (err) {
        deferred.reject(err);
      });
    } else {
      deferred.reject({error: "missing request"});
    }
    return deferred.promise;
  };

  ESClient.prototype.getMapping = function(request, searchType) {
    var deferred = $q.defer();
    if ( angular.isDefined(request.index) && request.index.length > 0 ) {

      this.request = request;

      if ( !angular.isDefined(this.response) ) {
        this.response = [];
      }

      this.busy = true;
      es.indices.getMapping(request).then(function (resp) {
        
        // if multiple indices holding same document type selected,
        // keeping track of the field added to the response array
        // with the uuids array, so we won't have duplicate shown to user
        var fields = [];
        var uuids = [];
        angular.forEach(resp, function(value, key) {
          fields = fields.concat(
            flattenJsonMapping(uuids, value.mappings).fields
          );
        });
        
        // if specific search such as geo, then only keep geo points fields
        switch (searchType) {
          case 'map':
            this.resp = $filter('filter')(this.resp, { type: "geo_point" });
            break;
          case 'text':
            this.resp = fields;
            break;
        }

        this.busy = false;
        deferred.resolve(this);
      }.bind(this), function (err) {
        deferred.reject(err);
      });
    } else {
      deferred.reject({error: "missing request"});
    }
    return deferred.promise;
  };

  var flattenJsonMapping = function(uuids, mapping, field) {   
    var fields = [];

    if ( angular.isDefined(mapping["_default_"]) ) {
      delete mapping["_default_"];
    }

    if ( angular.isDefined(mapping["dynamic_templates"]) ) {
      delete mapping["dynamic_templates"];
    }

    angular.forEach(mapping, function(value, key) {

      var newField;
      if ( angular.isUndefined(field) ) {
        newField = {
          type: key,
          array_path: "",
          dot_path: ""
        }
      } else {
        newField = {
          documentType: ( angular.isDefined(field.documentType) ? field.documentType : field.type ),
          array_path: field.array_path+"[\""+key+"\"]",
          dot_path: field.dot_path+(field.dot_path.length > 0 ? "." : "" )+key,
          name: key,
          type: value.type
        }
      }

      if ( angular.isDefined(value.properties) ) {
        fields = fields.concat(flattenJsonMapping(uuids, value.properties, newField).fields);
      } else if ( angular.isDefined(value.fields) ) {
        fields = fields.concat(flattenJsonMapping(uuids, value.fields, newField).fields);
      } else {
        if ( uuids.indexOf(newField.dot_path) < 0 ) {
          uuids.push(newField.dot_path);
          fields.push(newField);
        }
      }
    });

    return {"uuids": uuids, "fields": fields};
  }

  return ESClient;
}]);