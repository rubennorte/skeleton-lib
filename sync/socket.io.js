
/*!
 * Skeleton.js - SocketIOSync
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define(['./util/namespace'], function(Namespace){

  var socket = null;

  var SocketIOSync = {

    setSocket: function(sock){
      console.info('SocketIOSync', 'setSocket', this, sock);
      socket = sock;
    },

    sync: function(method, model, options){
      console.debug('SocketIOSync', 'sync', this, arguments);

      options || (options = {});

      var namespace = Namespace.get(model);

      var data = options.data;
      if (!data && model && (method == 'create' || method == 'update')) {
        data = model.toJSON();
      }

      socket.emit(namespace + ':' + method, data, function(error, response){
        if (error){
          options.error && options.error(error);
        } else {
          options.success && options.success(response);
        }
      });

      // TODO replace with jQuery xhr-like promise
      return {};
    },

    startSync: function(model){
      console.trace('SocketIOSync', 'startSync', this, model);

      if (model.models){
        // Is collection
        model._serverCreate = function(data){
          if (!data) return;

          if (!(data instanceof Array)) data = [data];

          for (var i=0; i<data.length; i++){
            var modelData = data[i];
            var exists = model.get(modelData.id);
            if (!exists) {
              model.add(modelData, {silent: true});
            } else {
              modelData.fromServer = true;
              exists.set(modelData, {silent: true});
            }
          }

          // Notify changes
          model.reset(model.models);
        };

        var namespace = Namespace.get(model);
        socket.on(namespace + ':create', model._serverCreate);

      } else {
        // Is model

        model._serverChange = function(data){
          model.set(data);
        };

        model._serverDelete = function(){
          if (model.collection) {
            model.collection.remove(model);
          } else {
            model.trigger('remove', model);
          }
        };

        var namespace;

        function bindEvents(){
          namespace = Namespace.get(model);
          var updateEvent = namespace + ':update',
              deleteEvent = namespace + ':delete';
          socket.on(updateEvent, model._serverChange);
          socket.on(deleteEvent, model._serverDelete);
        }

        function unbindEvents(){
          var updateEvent = namespace + ':update',
              deleteEvent = namespace + ':delete';
          socket.removeListener(updateEvent, model._serverChange);
          socket.removeListener(deleteEvent, model._serverDelete);
        }

        // If model id changes then does the namespace and we
        // must update the update and delete event names
        model.on('change:id', function(){
          unbindEvents();
          bindEvents();
        });

        bindEvents();
      }
    },

    stopSync: function(model){
      console.trace('SocketIOSync', 'stopSync', this, model);

      var namespace = Namespace.get(model);

      if (model.models){
        // Is collection
        socket.removeListener(namespace + ':create', model._serverCreate);
      } else {
        // Is model
        socket.removeListener(namespace + ':update', model._serverChange);
        socket.removeListener(namespace + ':delete', model._serverDelete);
      }
    }

  };

  return SocketIOSync;

});
