
/*!
 * Skeleton.js - Model
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  'use!backbone',
  'use!underscore'
], function(Backbone, _){
  
  /**
   * Skeleton model definition
   */
  var Model = Backbone.Model.extend({

    /**
     * Backbone fetch function, redefined to provide support for reload option
     * and loading/loaded flags and events
     */
    fetch: function(options){
      options = options ? _.clone(options) : {};

      // If not reload and model is not empty, sync is not necessary
      if (options.reload === undefined) options.reload = true;
      if (!options.reload && this.isLoaded()){
        options.success && options.success(this);
        // TODO return something that implements the promise interface
        return;
      }

      // Increment loading count (o set as 1)
      if (!this._loading)
        this._loading = 1;
      else
        this._loading++;

      // Set new success and error callbacks
      var self = this,
          success = options.success,
          error = options.error;
      options.success = function(){
        self._loading--;
        self._loaded = true;
        success && success();
      };
      options.error = function(){
        self._loading--;
        error && error();
      };

      // Trigger syncing event
      this.trigger('syncing', this, options);

      // return super.fetch(options);
      return Backbone.Collection.prototype.fetch.call(this, options);
    }

    /**
     * Returns true if the model is being loaded from the server
     */
    isLoading: function(){
      return !!this._loading;
    },

    /**
     * Returns true if the model has ever been loaded from the server
     */
    isLoaded: function(){
      return !!this._loaded;
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
        if (!persist)
          persist = _(json).keys();

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

  });

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