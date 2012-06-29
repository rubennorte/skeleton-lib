
/*!
 * Skeleton.js - Collection
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  'backbone',
  'underscore'
], function(Backbone, _){

  /**
   * Skeleton collection definition
   */
  var Collection = Backbone.Collection.extend({

    /**
     * Backbone fetch function, redefined to provide support for reload option
     * and send the content of the _data property if the data option is not set
     */
    fetch: function(options){
      options = options ? _.clone(options) : {};

      // If not reload and collection is not empty, sync is not necessary
      if (options.reload === undefined) options.reload = true;
      if (!options.reload && this.isLoaded()){
        options.success && options.success(this);
        // TODO return something that implements the promise interface
        return;
      }

      // Send stored data (for pagination, filtering, etc.)
      if (!options.data && !_(this._data).isEmpty()){
        options.data = this._data;
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
    },

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
    }

  });

  return Collection;
  
});