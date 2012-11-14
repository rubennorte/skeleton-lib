
/*!
 * Skeleton.js - App
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  'backbone',
  './util/extend',
  'underscore'
], function(Backbone, extend, _){

  'use strict';

  function App(){}

  _.extend(App.prototype, Backbone.Events, {

    initialize: function(){
      this.trigger('initialize:before');
      this.trigger('initialize');
      this.trigger('initialize:after');
    }

  });

  App.extend = extend;

  return App;

});