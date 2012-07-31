
/*!
 * Skeleton.js - URL
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define(function(){

  'use strict';

    return {

    /**
     * Joins the specified url fragments in another valid url fragment
     */
    join: function(url){
      // Remove trailing slash
      if (url.charAt(url.length-1) == '/') url = url.slice(0, -1);

      for (var i=1; i<arguments.length; i++){
        var part = arguments[i];
        // Add leading slash
        if (part.charAt(0) != '/') part = '/' + part;
        // Remove trailing slash
        if (part.charAt(part.length-1) == '/') part = part.slice(0, -1);

        url += part;
      }

      return url;
    },

    /**
     * Parses the specified URI and returns an object containing its parts
     */
    parseUri: function(str){
      var PARSER = /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/;
      var m   = PARSER.exec(str),
          key = ["source","protocol","authority","userInfo","user","password",
                 "host","port","relative","path","directory","file","query",
                 "anchor"],
          uri = {},
          i   = 14;
      while (i--) uri[key[i]] = m[i] || "";
      return uri;
    }
    
  };

});