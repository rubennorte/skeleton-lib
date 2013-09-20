
/*!
 * Skeleton.js - History
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  'backbone',
  'config',
  './util/url',
  'underscore'
], function(Backbone, config, url, _){

  'use strict';

  // Create the history object if it's not created, as Backbone does
  Backbone.history = Backbone.history || new Backbone.History();

  _.extend(Backbone.history, {

    /**
     * Start method redefined to add some default values
     */
    start: function(options){
      // Set default options
      options = options || {};
      if (typeof options.root === 'undefined'){
        options.root = url.parseUri(_.result(config.url, 'root')).path;
      }
      if (typeof options.pushState === 'undefined'){
        options.pushState = true;
      }

      Backbone.History.prototype.start.call(this, options);
    },

    /**
     * Generates a URL replacing the route params with the values of those
     * params in the specified object
     */
    generateRoute: function(route, params){
      return route.replace(/:(\w+)/g, function(match, paramName){
        return params[paramName];
      });
    },

    /**
     * Returns the current route
     */
    getCurrentRoute: function(){
      var current = Backbone.history.fragment,
          root = Backbone.history.options.root;
      // Fixes error in backbone
      if (root && current.indexOf(root) === 0){
        current = current.substr(root.length);
      }
      return current;
    },

    /**
     * Triggers again the handler for the current route
     */
    refresh: function(){
      this.loadUrl(this.getCurrentRoute());
    }

  });

  return Backbone.history;
  
});