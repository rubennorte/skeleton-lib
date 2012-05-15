
/*!
 * Skeleton.js - LocalStorageSync
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define(['underscore', './util/namespace'], function(_, Namespace){

  function syncCollection(method, model, options){
    var url = Namespace.get(model, options);

    if (!localStorage[url]) localStorage[url] = '{}';

    var collection = JSON.parse(localStorage[url]),
        models = _(collection).values();

    options.success && options.success(models);

    return {};
  }

  function syncModel(method, model, options){
    var url = Namespace.get(model, options);

    if (!localStorage[url]) localStorage[url] = '{}';

    var collection = JSON.parse(localStorage[url]),
        modelData;

    if (method == 'read'){
      // Readonly method
      modelData = collection[model.id];
      if (modelData) options.success && options.success(modelData);
      else options.error && options.error('Not found');

    } else {
      // Modifying method
      modelData = collection[model.id];

      if (method == 'create'){
        modelData = model.toJSON();
        modelData.id = generateId(collection);
        collection[modelData.id] = modelData;

        options.success && options.success(modelData);

      } else if (method == 'update'){

        modelData = model.toJSON();
        collection[model.id] = modelData;

        if (!modelData){
          options.error && options.error('Not found');
        } else {
          options.success && options.success(modelData);
        }

      } else if (method == 'delete'){
        delete collection[model.id];
      }

      // Update stored collection
      localStorage[url] = JSON.stringify(collection);

    }

    return {};
  }

  function generateId(collection){
    // Generate id by incrementing the maximum numeric id
    // found in the collection (1 otherwise).
    var numericIds = _(collection)
      .chain()
      .keys()
      .map(function(key){
        return parseInt(key);
      })
      .compact()
      .value();
    return numericIds.length > 0 ? _(numericIds).max() + 1 : 1;
  }

  var LocalStorageSync = {
    
    sync: function(method, model, options){
      console.debug('LocalStorageSync', 'sync', this, arguments);

      options || (options = {});

      if (!LocalStorageSync.isSupported()){
        options.error && options.error('The browser does not support local storage');
        return false;
      }

      if (model.models) return syncCollection(method, model, options);
      else return syncModel(method, model, options);
    },

    isSupported: function(){
      return typeof(Storage) !== "undefined"
        && typeof(localStorage) !== 'undefined';
    }

  };

  return LocalStorageSync;

});
