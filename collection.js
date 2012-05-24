
/*!
 * Skeleton.js - Collection
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  'use!backbone',
  'use!underscore',
  './sync/socket.io'
], function(Backbone, _, IOSync){

  var Collection = Backbone.Collection.extend({

    fetch: function(options){
      options = options ? _.clone(options) : {};

      // If not reload and collection is not empty, sync is not necessary
      if (options.reload === undefined) options.reload = true;
      if (!options.reload && this.size() > 0){
        options.success && options.success(this);
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