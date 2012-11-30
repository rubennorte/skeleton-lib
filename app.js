
/*!
 * Skeleton.js - App
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  'backbone',
  './util/extend',
  'underscore',
  'jquery',
  './util/promise-aggregator'
], function(Backbone, extend, _, $, PromiseAggregator){

  'use strict';

  // Triggers the initialization event and,
  // when all returned promises has been resolved, resolves the event promise
  // If it fails, it calls initializationError with the event name and the error arguments
  function triggerInitializationEvent(event, eventPromise){
    var promiseAggregator = new PromiseAggregator();
    /*jshint validthis:true */
    this.trigger(event, promiseAggregator);
    $.when.apply(null, promiseAggregator.all()).then(eventPromise.resolve, _.bind(this.initializationError, this, event));
  }

  // When the previous event has finished, triggers the current event
  // and returns its promise
  function triggerWhen(previous, event){
    var current = $.Deferred();
    /*jshint validthis:true */
    $.when(previous).done(_.bind(triggerInitializationEvent, this, event, current));
    return current;
  }

  function App(){}

  _.extend(App.prototype, Backbone.Events, {

    INITIALIZATION_EVENTS: ['initialize:before', 'initialize', 'initialize:after'],

    initialize: function(){
      _.reduce(this.INITIALIZATION_EVENTS, triggerWhen, true, this);
    },

    initializationError: function(event /*, errorArgs... */){}

  });

  App.extend = extend;

  return App;

});