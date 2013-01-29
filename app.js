
/*!
 * Skeleton.js - App
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  'backbone',
  'underscore',
  'q',
  './util/promise-aggregator'
], function(Backbone, _, Q, PromiseAggregator){

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
    Q.all(promiseAggregator.all()).then(eventPromise.resolve, initializationError);
  }

  // When the previous event has finished, triggers the current event
  // and returns its promise
  function triggerWhen(previous, event){
    /*jshint validthis:true */
    // Create event promise
    var current = Q.defer();
    var boundTrigger = _.bind(triggerInitializationEvent, this, event, current);

    // Trigger initialization event when the previous promise is resolved
    Q.all(previous).done(boundTrigger);

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

  App.extend = Backbone.Model.extend;

  return App;

});