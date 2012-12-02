
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

  // Triggers the initialization event and, when all returned promises has been
  // resolved, resolves the event promise. If it fails, it calls
  // initializationError with the event name and the error arguments
  function triggerInitializationEvent(event, eventPromise){
    /*jshint validthis:true */

    // Trigger initialization event
    var promiseAggregator = new PromiseAggregator();
    this.trigger(event, promiseAggregator);

    // Resolve event promise when all initialization promises have been resolved
    var initializationError = _.bind(this.initializationError, this, event);
    $.when.apply(null, promiseAggregator.all())
        .then(eventPromise.resolve, initializationError);
  }

  // When the previous event has finished, triggers the current event
  // and returns its promise
  function triggerWhen(previous, event){
    /*jshint validthis:true */
    // Create event promise
    var current = $.Deferred();
    var boundTrigger = _.bind(triggerInitializationEvent, this, event, current);

    // Trigger initialization event when the previous promise is resolved
    $.when(previous).done(boundTrigger);

    // Return the current promise
    return current.promise();
  }

  function App(){}

  _.extend(App.prototype, Backbone.Events, {

    INITIALIZATION_EVENTS: [
      'initialize:before', 'initialize', 'initialize:after'
    ],

    initialize: function(){
      _.reduce(this.INITIALIZATION_EVENTS, triggerWhen, true, this);
    },

    initializationError: function(event /*, errorArgs... */){}

  });

  App.extend = extend;

  return App;

});