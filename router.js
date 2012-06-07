
/*!
 * Skeleton.js - Router
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  'use!backbone',
  'config'
], function(Backbone, config){

  /**
   * Skeleton router definition
   */
  var Router = Backbone.Router.extend({

    start: function(options){
      // Set default options
      options || (options = {});
      if (typeof(options.root) == 'undefined')
        options.root = config.url.root;
      if (typeof(options.pushState) == 'undefined')
        options.pushState = true;

      Backbone.history.start(options);
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
      if (root && current.indexOf(root) == 0){
        current = current.substr(root.length);
      }
      return current;
    }

  });

  return Router;
  
});