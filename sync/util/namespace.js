
/*!
 * Skeleton.js - Namespace
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  'use!underscore'
], function(_){

  return {

    /**
     * Returns the namespace of a model or collection
     * by removing the extra slashes and the model id (if corresponds)
     * from its url
     */
    get: function(model){
      var url = _.result(model, 'url');

      if (url){
        // Remove leading slashes
        var parts = _(url.split('/')).compact();

        if (model.isNew && !model.isNew()){
          // Remove last part (id)
          parts.splice(parts.length-1);
        }

        url = parts.join('/');
      }

      return url;
    }

  };

});