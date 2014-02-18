
/*!
 * Skeleton.js - Model
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  'backbone',
  'underscore',
  './util/url',
  'config',
  'q'
], function(Backbone, _, url, config, Q){
  
  'use strict';
  
  /**
   * Skeleton model definition
   */
  var Model = Backbone.Model.extend({

    _loaded: false,
    _loadingCount: 0,
    _data: {},

    /**
     * Backbone fetch function, redefined to provide support for reload option
     * and loading/loaded flags
     */
    fetch: function(options){
      options = options ? _.clone(options) : {};
      
      // If reload option is set to false and model has already been loaded,
      // return immediately
      if (options.reload === false && this.isLoaded()){
        if (options.success){
          options.success(this, null, options);
        }
        this.trigger('sync', this, null, options);

        // Return promise to make this function fully compatible with Backbone's
        return Q.resolve();
      }

      // Increment loading count
      this._loadingCount++;

      // Add callbacks to decrease loading count and set loaded to true
      options.success = bindSuccess(this, options.success);
      options.error = bindError(this, options.error);

      // return super.fetch(options);
      return Backbone.Model.prototype.fetch.call(this, options);
    },

    /**
     * Returns true if the model is being loaded from the server
     */
    isLoading: function(){
      return !!this._loadingCount;
    },

    /**
     * Returns true if the model has ever been loaded from the server
     */
    isLoaded: function(){
      return this._loaded;
    },

    /**
     * Backbone toJSON function, redefined to provide support for
     * persistAttributes and discardAttributes options.
     */
    toJSON: function(key, value, options){
      var json = Backbone.Model.prototype.toJSON.apply(this, arguments);

      if (this.persistAttributes || this.discardAttributes){

        // If persistAttributes is defined, keep only selected attributes
        var persist = selectKeys(json, this.persistAttributes);
        if (!persist){
          persist = _(json).keys();
        }

        // If discardAttributes is defined, remove selected attributes
        var discard = selectKeys(json, this.discardAttributes);
        if (discard){
          persist = _(persist).difference(discard);
        }
      
        // Pick the selected attributes
        json = _(json).pick(persist);
      }

      return json;
    }

  }, {

    /**
     * Returns the backend url for the specified path
     */
    backendUrl: function(path){
      return url.join(_.result(config.url, 'backend'), path);
    }

  });

  /**
   * Returns a new success function that updates the loading count
   * and the loaded flag.
   */
  function bindSuccess(model, success){
    return function(){
      model._loadingCount--;
      model._loaded = true;
      if (success){
        success.apply(model, arguments);
      }
    };
  }

  /**
   * Returns a new error function that updates the loading count
   */
  function bindError(model, error){
    return function(){
      model._loadingCount--;
      if (error){
        error.apply(model, arguments);
      }
    };
  }

  /**
   * Returns the selected keys of the specified object.
   * If selected is an array, the selected keys are those.
   * If selected is an object, the selected keys are which has non-falsy values.
   * If selected is a function, the selected keys are which makes the function
   * return a non-falsy value.
   */
  function selectKeys(object, selected){
    if (_(selected).isArray()){
      return selected;
    } else if (_(selected).isFunction()){
      return _(object).chain().map(function(value, key){
        return selected(key, value) ? key : null;
      }).compact().value();
    } else if (_(selected).isObject()){
      return _(object).chain().map(function(value, key){
        return value ? key : null;
      }).compact().value();
    }
  }

  return Model;
  
});