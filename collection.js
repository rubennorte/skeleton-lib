
/*!
 * Skeleton.js - Collection
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  'use!backbone',
  'use!underscore'
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
      if (!options.reload && this.size() > 0){
        options.success && options.success(this);
        // TODO return something that implements the promise interface
        return;
      }

      // Send stored data (for pagination, filtering, etc.)
      if (!options.data && !_(this._data).isEmpty()){
        options.data = this._data;
      }

      // super.fetch(options);
      Backbone.Collection.prototype.fetch.call(this, options);
    }

  });

  return Collection;
  
});