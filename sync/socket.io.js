
/*!
 * Skeleton.js - SocketIOSync
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  './util/namespace',
  'backbone'
], function(Namespace, Backbone){

  'use strict';

  // The socket used to sync
  var socket = null;

  /**
   * Module for socket.io model and collection synchronization
   * with support for push updates
   */
  var SocketIOSync = {

    // Callback functions
    _serverCreate: null,
    _serverDelete: null,
    _serverChange: null,

    /**
     * Assigns the socket that must be used to sync
     */
    setSocket: function(sock){
      console.info('skeleton/sync/socket.io', 'Socket set to', sock);
      socket = sock;
    },

    /**
     * Backbone sync implementation using socket.io communication
     */
    sync: function(method, model, options){
      options = options || {};

      // Get the namespace of the model (or collection)
      var ns = Namespace.get(model);

      // Send a JSON representation of the model if the data option
      // is not defined and is a create or update method
      var data = options.data;
      if (!data && model && (method == 'create' || method == 'update')) {
        data = model.toJSON();
      }

      var eventName = ns + ':' + method;

      console.debug('skeleton/sync/socket.io', 'Emitting event',
        eventName, 'with params', data);

      // Emit the sync event with data as argument
      socket.emit(eventName, data, function(error, response){
        if (error){
          console.error('skeleton/sync/socket.io',
            'Error response received from server', error);
          if (options.error) options.error(error);
        } else {
          console.info('skeleton/sync/socket.io',
            'Synchronization done successfully. Received', response,
            'from server');
          if (options.success) options.success(response);
        }
      });

      // TODO return something that implements the promise interface
      return {};
    },

    startSync: function(model){
      // If model is not defined assume that it has been extended
      // with this module
      if (!model) model = this;

      // If models property is defined, assume that it's a collection
      if (model instanceof Backbone.Collection){
        startCollectionSync(model);
        console.debug('skeleton/sync/socket.io',
          'Active sync started for collection', model);
      } else {
        startModelSync(model);
        console.debug('skeleton/sync/socket.io',
          'Active sync started for model', model);
      }
    },

    stopSync: function(model){
      // If model is not defined assume that it has been extended
      // with this module
      if (!model) model = this;

      var ns = Namespace.get(model);

      // If models property is defined, assume that it's a collection
      if (model instanceof Backbone.Collection){
        socket.removeListener(ns + ':create', model._serverCreate);
        console.debug('skeleton/sync/socket.io',
          'Active sync stopped for collection', model);
      } else {
        socket.removeListener(ns + ':update', model._serverChange);
        socket.removeListener(ns + ':delete', model._serverDelete);
        console.debug('skeleton/sync/socket.io',
          'Active sync stopped for model', model);
      }
    }
  };

  function startCollectionSync(collection){
    // Store a reference to the callback function
    collection._serverCreate = function(data){
      console.debug('skeleton/sync/socket.io', 'Data', data,
        'received from server to create in collection', collection);

      if (!data) return;

      // If the returned value is a single model data, insert into an array
      if (!(data instanceof Array)) data = [data];


      for (var i=0; i<data.length; i++){
        var modelData = data[i];
        var exists = collection.get(modelData.id);
        // Add or update the collection with the server data
        if (!exists) {
          exists = collection.add(modelData, {silent: true});
          console.info('skeleton/sync/socket.io', 'Model', exists,
            'added to collection', collection);
        } else {
          exists.set(modelData, {silent: true});
          console.info('skeleton/sync/socket.io', 'Model', exists,
            'updated in collection', collection);
        }
      }

      // Trigger the reset event
      collection.trigger('reset', collection);
    };

    // Bind the server create callback
    var ns = Namespace.get(collection);
    var eventName = ns + ':create';
    socket.on(eventName, collection._serverCreate);
  }

  function startModelSync(model){
    // On change, simply update the model attributes
    model._serverChange = function(data){
      model.set(data);
      console.info('skeleton/sync/socket.io', 'Model', model,
        'updated with data', data, 'received from server');
    };

    // On delete, remove the collection or trigger the remove event
    // Remove function from model mustn't be called because the model
    // is already deleted in the server
    model._serverDelete = function(){
      if (model.collection) {
        model.collection.remove(model);
      } else {
        model.trigger('remove', model);
      }
      console.info('skeleton/sync/socket.io', 'Model', model,
        'deleted from server');
    };

    var ns;

    function bindEvents(){
      ns = Namespace.get(model) + '/' + model.id;
      var updateEvent = ns + ':update',
          deleteEvent = ns + ':delete';
      socket.on(updateEvent, model._serverChange);
      socket.on(deleteEvent, model._serverDelete);
      console.debug('skeleton/sync/socket.io',
        'Removed callbacks for events', updateEvent, 'and', deleteEvent,
        'in model', model);
    }

    function unbindEvents(){
      var updateEvent = ns + ':update',
          deleteEvent = ns + ':delete';
      socket.removeListener(updateEvent, model._serverChange);
      socket.removeListener(deleteEvent, model._serverDelete);
      console.debug('skeleton/sync/socket.io',
        'Added callbacks for events', updateEvent, 'and', deleteEvent,
        'in model', model);
    }

    // If model id changes then does the namespace and we
    // must bind the update and delete callbacks to the events associated to
    // the new namespace
    model.on('change:id', function(){
      unbindEvents();
      bindEvents();
    });

    bindEvents();
  }

  return SocketIOSync;

});
