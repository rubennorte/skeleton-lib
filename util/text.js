
/*!
 * Skeleton.js - TextUtils
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  './sprintf-0.7-beta1'
], function(){
  
  var TextUtils = {

    // From sprintf.js
    sprintf: sprintf,
    vsprintf: vsprintf,

    trim: function(str) {
      return str.replace(/^\s+|\s+$/g,"");
    },
    
    ltrim: function(str){
      return str.replace(/^\s+/,"");
    },
    
    rtrim: function(str){
      return str.replace(/\s+$/,"");
    },
    
    lpad: function(str, append, number){
      while (str.length < number){
        str = append + str;
      }
      return str;
    },
    
    rpad: function(str, append, number){
      while (str.length < number){
        str += append;
      }
      return str;
    },

    capitalize: function(str){
      if (str.length == 0) return '';
      else return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
    },
       
    camelize: function(str){
      var result = [];
      str.match(/[a-z]+/gi).forEach(function(match){
        result.push(match.charAt(0).toUpperCase() + match.toLowerCase().slice(1));
      });
      return result.join('');
    }

  };

  return TextUtils;

});
