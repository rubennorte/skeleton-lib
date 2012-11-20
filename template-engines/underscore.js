 
/*!
 * Skeleton.js - UnderscoreTemplateEngine
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */
 
define([
  'underscore'
], function(_){
  
  'use strict';
  
  /**
   * Module definition
   */
  var UnderscoreTemplateEngine = {

    /**
     * Returns a compiled version of the specified template, which can be
     * used in render function
     */
    compile: function(template){
      return _.template(template);
    },

    /**
     * Renders the specified template with the specified context and returns
     * the resulting string
     */
    render: function(template, context){
      if (typeof(template) === 'function') return template(context);
      else return _.template(template, context);
    }

  };

  return UnderscoreTemplateEngine;

});