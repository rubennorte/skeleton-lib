
/*!
 * Skeleton.js - Namespace
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  'underscore'
], function(_){

  'use strict';

  return {

    /**
     * Returns the namespace of a model or collection
     * by removing the leading slash (if any)
     * and the model id (if corresponds) from its url
     */
    get: function(model){
      var url = _.result(model, 'url');

      if (url){
        // Remove leading slash
        if (url.indexOf('/') === 0)
          url = url.substr(1);
        
        var parts = url.split('/');

        if (model.isNew && !model.isNew()){
          // Remove last part (with id)
          parts.splice(parts.length-1, 1);
        }

        url = parts.join('/');
      }

      return url;
    }

  };

});