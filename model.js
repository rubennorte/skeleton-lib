
/*!
 * Skeleton.js - Model
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  'use!backbone',
  './sync/socket.io'
], function(Backbone, IOSync){
  
  var Model = Backbone.Model.extend({

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

  function selectKeys(object, attributes){
    if (_(attributes).isArray()){
      return attributes;
    } else if (_(attributes).isFunction()){
      return _(object).chain().map(function(value, key){
        return attributes(key, value) ? key : null;
      }).compact().value();
    } else if (_(attributes).isObject()){
      return _(object).chain().map(function(value, key){
        return value ? key : null;
      }).compact().value();
    }
  }

  return Model;
  
});