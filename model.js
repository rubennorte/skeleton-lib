
/*!
 * Skeleton.js - Model
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  'use!backbone'
], function(Backbone){
  
  /**
   * Skeleton model definition
   */
  var Model = Backbone.Model.extend({

    /**
     * Backbone fetch function, redefined to provide support for
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