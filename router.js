
/*!
 * Skeleton.js - Router
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  'backbone'
], function(Backbone){

  var Router = Backbone.Router.extend({

    generateFragment: function(route, params){
      return route.replace(/:(\w+)/g, function(match, paramName){
        return params[paramName];
      });
    }

  });

  return Router;
  
});