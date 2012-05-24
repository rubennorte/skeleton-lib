
/*!
 * Skeleton.js - Router
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  'use!backbone'
], function(Backbone){

  /**
   * Skeleton router definition
   */
  var Router = Backbone.Router.extend({

    /**
     * Generates a URL replacing the route params with the values of those
     * params in the specified object
     */
    generateFragment: function(route, params){
      return route.replace(/:(\w+)/g, function(match, paramName){
        return params[paramName];
      });
    }

  });

  return Router;
  
});