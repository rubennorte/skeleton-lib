
/*!
 * Skeleton.js - Model
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  'backbone',
  './sync/socket.io'
], function(Backbone, IOSync){
  
  function validateSync(method, model, options){
    // Check if the model is readonly and it's being modified
    if (model.readonly &&
        (method == 'create' || method == 'update' || method == 'destroy')){
      return 'Readonly models cannot be saved';
    }
  }

  var Model = Backbone.Model.extend({

    sync: function(method, model, options){
      // Validate model for sync
      var error = validateSync(method, model, options);
      if (error){
        options && options.error(error);
        return false;
      }

      // super.sync();
      return Backbone.Model.sync.apply(this, arguments);
    },

    /**
     * IOSync shortcuts
     */

    startSync: function(){
      IOSync.startSync(this);
    },

    stopSync: function(){
      IOSync.stopSync(this);
    }

  }, {

    // IOSync shortcut
    ioSync: function(method, model, options){
      // Validate model for sync
      var error = validateSync(method, model, options);
      if (error){
        options && options.error(error);
        return false;
      }

      return IOSync.sync(method, model, options);
    }

  });

  return Model;
  
});