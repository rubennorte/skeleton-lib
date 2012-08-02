
/*!
 * Skeleton.js - LocalStorageSync
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  'underscore',
  './util/namespace',
  'backbone'
], function(_, Namespace, Backbone){

  'use strict';

  /**
   * Reads the collection data from localStorage
   */
  function syncCollection(method, model, options){
    // Get the namespace of the collection
    var ns = Namespace.get(model, options);

    // If the collection is not already stored in localStorage, return an
    // empty collection
    if (!localStorage[ns]){
      console.debug('skeleton/sync/local-storage', 'Uninitialized namespace',
        ns, 'for collection', model, '. Initializing...');
      localStorage[ns] = '{}';
    }

    // Parse the collection JSON data from localStorage
    var collection = JSON.parse(localStorage[ns]);

    // Get the models, stored as the values of the collection
    var models = _(collection).values();

    console.info('skeleton/sync/local-storage', 'Data', models,
      'returned to collection', model);

    // Call the success callback with read models
    options.success && options.success(models);

    // TODO return something that implements the promise interface
    return {};
  }

  function syncModel(method, model, options){
    // Get the namespace of the model
    var ns = Namespace.get(model, options);

    // Read the collection associated with the namespace
    if (!localStorage[ns]){
      console.debug('skeleton/sync/local-storage', 'Uninitialized namespace',
        ns, 'for model', model, '. Initializing...');
      localStorage[ns] = '{}';
    }

    // Parse the collection JSON data from localStorage
    var collection = JSON.parse(localStorage[ns]);
    var modelData;

    if (method == 'read'){
      // Readonly method

      // Retrieve the model data from the collection
      modelData = collection[model.id];
      if (modelData){
        console.info('skeleton/sync/local-storage', 'Data', modelData,
          'returned to model', model);
        options.success && options.success(modelData);
      } else {
        console.error('skeleton/sync/local-storage', 'Model', model,
          'data not found in localStorage object');
        options.error && options.error('Not found');
      }

    } else {
      // Modifying method

      // Retrieve the model data from the collection
      modelData = collection[model.id];

      // Update the model data from its JSON representation
      modelData = model.toJSON();

      if (method == 'create'){
        // Assign a new id to the model
        modelData.id = generateId(collection);
        // Store the model in the collection
        collection[modelData.id] = modelData;
      } else if (method == 'update'){

        // If the model was not stored in the collection,
        // call the error callback
        if (!modelData){
          console.error('skeleton/sync/local-storage', 'Model', model,
            'data not found in localStorage object');
          options.error && options.error('Not found');
          return;
        }

        // Update the model in the collection
        collection[model.id] = modelData;
      } else if (method == 'delete'){
        // Delete the model from the collection
        delete collection[model.id];
      }

      // Store modified collection in localStorage
      localStorage[ns] = JSON.stringify(collection);
       
      if (method == 'create' || method == 'update')
        console.info('skeleton/sync/local-storage', 'Model', model,
          'data stored successfully in localStorage', modelData);
      else
        console.info('skeleton/sync/local-storage', 'Model', model,
          'data deleted from localStorage object');
      
      // Call the success callback
      options.success && options.success(modelData);
    }

    // TODO return something that implements the promise interface
    return {};
  }

  /**
   * Generates a positive integer id for a new model in the specified collection
   */
  function generateId(collection){
    // Generate id by incrementing the maximum numeric id
    // found in the collection (1 otherwise).
    var numericIds = _(collection)
      .chain()
      .keys()
      .map(function(key){
        return parseInt(key, 10);
      })
      .compact()
      .value();
    return numericIds.length > 0 ? _(numericIds).max() + 1 : 1;
  }

  /**
   * Module definition
   */
  var LocalStorageSync = {
    
    /**
     * Backbone sync implementation using localStorage
     */
    sync: function(method, model, options){
      options || (options = {});

      if (!LocalStorageSync.isSupported()){
        var errorMsg = 'The browser does not support local storage';
        console.error('skeleton/sync/local-storage', errorMsg);
        options.error && options.error(errorMsg);
        return false;
      }

      // Call the appropiate function according to the type of model
      if (model instanceof Backbone.Collection)
        return syncCollection(method, model, options);
      else
        return syncModel(method, model, options);
    },

    /**
     * Determines if the browser supports HTML5 local storage
     */
    isSupported: function(){
      return typeof(Storage) !== "undefined" &&
        typeof(localStorage) !== 'undefined';
    }

  };

  return LocalStorageSync;

});
