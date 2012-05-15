 
/*!
 * Skeleton.js - UnderscoreTemplateEngine
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */
 
define([
  'underscore',
], function( _){
  
  var UnderscoreTemplateEngine = {

    render: function(template, context){
      if (typeof(template) == 'function') return template(context);
      else return _.template(template, context);
    }

  };

  return UnderscoreTemplateEngine;

});