'use strict';

angular.module('workbook.elasticsearch.factories', [])
.service('es', function (esFactory) {
  return esFactory({
    host: 'bahaaldine:bazarmi@localhost:9200',
    log: 'warning'
  });
})
.factory('ESClient', ['$q', 'es', function($q, es) {
  var ESClient = function(pageSize, from) {
    this.pageSize = pageSize;
    this.from = from;
    this.more = true;
  };

  ESClient.prototype.nextPage = function(request) {

    if ( angular.isDefined(request) ) {
      var deferred = $q.defer();

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

      return deferred.promise;
    }
  };

  return ESClient;
}]);