
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

    load: function(options){
      // TODO do it better!
      if (this.size() == 0){
        this.fetch(options);
      } else {
        options.success && options.success(this);
      }
      return this;
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
    ioSync: _.bind(IOSync.sync, IOSync)

  });

  return Collection;
  
});