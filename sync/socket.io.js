
/*!
 * Skeleton.js - SocketIOSync
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  './util/namespace'
], function(Namespace){

  'use strict';

  // The socket used to sync
  var socket = null;

  /**
   * Module for socket.io model and collection synchronization
   * with support for push updates
   */
  var SocketIOSync = {

    /**
     * Assigns the socket that must be used to sync
     */
    setSocket: function(sock){
      console.info('SocketIOSync', 'setSocket', this, sock);
      socket = sock;
    },

    /**
     * Backbone sync implementation using socket.io communication
     */
    sync: function(method, model, options){
      console.debug('SocketIOSync', 'sync', this, arguments);

      options || (options = {});

      // Get the namespace of the model (or collection)
      var ns = Namespace.get(model);

      // Send a JSON representation of the model if the data option
      // is not defined and is a create or update method
      var data = options.data;
      if (!data && model && (method == 'create' || method == 'update')) {
        data = model.toJSON();
      }

      // Emit the sync event with data as argument
      socket.emit(ns + ':' + method, data, function(error, response){
        if (error){
          options.error && options.error(error);
        } else {
          options.success && options.success(response);
        }
      });

      // TODO return something that implements the promise interface
      return {};
    },

    startSync: function(model){
      console.trace('SocketIOSync', 'startSync', this, model);
      
      // If model is not defined assume that it has been extended
      // with this module
      if (!model) model = this;

      // If models property is defined, assume that it's a collection
      if (model.models){

        // Store a reference to the callback function
        model._serverCreate = function(data){
          if (!data) return;

          // If the returned value is a single model data, insert into an array
          if (!(data instanceof Array)) data = [data];


          for (var i=0; i<data.length; i++){
            var modelData = data[i];
            var exists = model.get(modelData.id);
            // Add or update the model with the server data
            if (!exists) {
              model.add(modelData, {silent: true});
            } else {
              exists.set(modelData, {silent: true});
            }
          }

          // Trigger the reset event
          model.reset(model.models);
        };

        // Bind the server create callback
        var ns = Namespace.get(model);
        socket.on(ns + ':create', model._serverCreate);

      } else {

        // On change, simply update the model attributes
        model._serverChange = function(data){
          model.set(data);
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
        };

        var ns;

        function bindEvents(){
          ns = Namespace.get(model) + '/' + model.id;
          var updateEvent = ns + ':update',
              deleteEvent = ns + ':delete';
          socket.on(updateEvent, model._serverChange);
          socket.on(deleteEvent, model._serverDelete);
        }

        function unbindEvents(){
          var updateEvent = ns + ':update',
              deleteEvent = ns + ':delete';
          socket.removeListener(updateEvent, model._serverChange);
          socket.removeListener(deleteEvent, model._serverDelete);
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
    },

    stopSync: function(model){
      console.trace('SocketIOSync', 'stopSync', this, model);

      // If model is not defined assume that it has been extended
      // with this module
      if (!model) model = this;

      var ns = Namespace.get(model);

      // If models property is defined, assume that it's a collection
      if (model.models){
        socket.removeListener(ns + ':create', model._serverCreate);
      } else {
        socket.removeListener(ns + ':update', model._serverChange);
        socket.removeListener(ns + ':delete', model._serverDelete);
      }
    }

  };

  return SocketIOSync;

});
