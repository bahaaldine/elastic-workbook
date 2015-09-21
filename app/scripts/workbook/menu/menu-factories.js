'use strict';

angular.module('workbook.menu.factories', [])
.factory('menu', ['$location', function ($location) {
  
  var sections = [{
    name: 'Getting Started',
    state: 'home.gettingstarted',
    type: 'link'
  }];

  sections.push({
    name: 'Demos',
    type: 'toggle',
    pages: [{
      name: 'Geoshapes',
      type: 'link',
      state: 'home.demos.geoshapes',
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