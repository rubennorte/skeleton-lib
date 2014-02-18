
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

  // When the previous event has finished, triggers the current event
  // and returns its promise
  function runStep(previousStep, step){
    return previousStep.then(function(){
      var promiseAggregator = new PromiseAggregator();
      this.trigger(step, promiseAggregator);
      return Q.all(promiseAggregator.all());
    });
  }

  function App(){}

  _.extend(App.prototype, Backbone.Events, {

    INITIALIZATION_EVENTS: [
      'initialize:before', 'initialize', 'initialize:after'
    ],

    initialize: function(){
      var self = this;
      var p = _.reduce(this.INITIALIZATION_EVENTS, runStep, Q.resolve(), this);
      p.error(_.bind(this.initializationError, this));
      return p;
    },

    initializationError: function(event /*, errorArgs... */){}
    
  });

  App.extend = Backbone.Model.extend;

  return App;

});