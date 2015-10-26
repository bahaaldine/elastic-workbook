'use strict';

angular.module('workbook.menu.factories', [])
.factory('menu', ['$location', function ($location) {
  
  var sections = [];

  sections.push({
    name: 'Search faces',
    state: 'home.face.search',
    type: 'link'
  },
  {
    name: 'Map faces',
    state: 'home.face.map',
    type: 'link'
  },
  {
    name: 'Analytic faces',
    state: 'home.face.analytics',
    type: 'link'
  },
  {
    name: 'Settings',
    state: 'home.settings',
    type: 'link'
  });

  sections.push({
    name: 'Text search',
    type: 'toggle',
    pages: [{
      name: 'Full text search',
      type: 'link',
      state: 'home.demos.text.fulltextsearch',
      icon: 'fa fa-globe'
    },{
      name: 'Fuzzy search',
      type: 'link',
      state: 'home.demos.text.fuzzysearch',
      icon: 'fa fa-globe'
    },{
      name: 'Type ahead',
      type: 'link',
      state: 'home.demos.text.typeahead',
      icon: 'fa fa-globe'
    },{
      name: 'Did you mean',
      type: 'link',
      state: 'home.demos.text.didyoumean',
      icon: 'fa fa-globe'
    }]
  });

  sections.push({
    name: 'Geo search',
    type: 'toggle',
    pages: [{
      name: 'Geoshapes',
      type: 'link',
      state: 'home.demos.geo.geoshapes',
      icon: 'fa fa-globe'
    },{
      name: 'Drag the map',
      type: 'link',
      state: 'home.demos.geo.dragthemap',
      icon: 'fa fa-globe'
    }]
  });

  sections.push({
    name: 'Faceted search',
    type: 'toggle',
    pages: [{
      name: 'Simple aggregation',
      type: 'link',
      state: 'home.demos.faceted.simpleaggregation',
      icon: 'fa fa-globe'
    }]
  });

  var self;

  return self = {
    sections: sections,

    toggleSelectSection: function (section) {
      self.openedSection = (self.openedSection === section ? null : section);
    },
    isSectionSelected: function (section) {
      return self.openedSection === section;
    },

    selectPage: function (section, page) {
      page && page.url && $location.path(page.url);
      self.currentSection = section;
      self.currentPage = page;
    }
  };
}]); 