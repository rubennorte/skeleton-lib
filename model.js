
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

      // Check if persistAttributes or discardAttributes properties are defined
      // and return proper attributes in that case
      if (_.isArray(this.persistAttributes)){
        json = _(json).pick(this.persistAttributes);
      } else if (_.isArray(this.discardAttributes)){
        for (var i in json){
          if (_(this.discardAttributes).include(i))
            delete json[i];
        }
      }

      return json;
    }

  });

  return Model;
  
});