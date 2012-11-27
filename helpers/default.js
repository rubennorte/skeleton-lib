
/*!
 * Skeleton.js - DefaultHelpers
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  'config',
  'underscore',
  // Used through underscore reference
  'underscore.string',
  '../i18n',
  '../util/url'
], function(config, _, _s, I18n, url){

  'use strict';

  /**
   * Joins the specified url fragments, starting from the end, util the current
   * fragment contains the host part
   */
  function joinUntilHost(){
    var fragments = _(arguments).toArray(),
        urlStr = '';
    while (fragments.length > 0){
      var fragment = fragments.pop();
      var parsed = url.parseUri(fragment);
      if (parsed.host) return url.join(fragment, urlStr);
      else urlStr = url.join(fragment, urlStr);
    }
    return urlStr;
  }

  return {

    // Config object
    config: config,

    // Underscore reference (it's passed to the underscore templates by the
    // engine itself, but we can't assume that we're using the underscore
    // template engine)
    _: _,

    // I18n and its main functions
    I18n: I18n,
    t: I18n.t,
    
    /**
     * Returns the backend url for the specified path
     */
    backendUrl: function(path){
      return url.join(config.url.backend, path);
    },

    /**
     * Returns the url of the specified path relative to the app root url
     */
    urlTo: function(dst){
      return joinUntilHost(config.url.root, dst);
    },

    /**
     * Returns the url of the specified path relative to the assets url
     */
    assetUrl: function(src){
      return joinUntilHost(config.url.root, config.url.assets, src);
    },

    /**
     * Returns the url of the specified path relative to the images url
     */
    imageUrl: function(src){
      return joinUntilHost(config.url.root, config.url.assets,
        config.url.images, src);
    },

    /**
     * Returns the url of the specified path relative to the stylesheets url
     */
    stylesheetUrl: function(src){
      return joinUntilHost(config.url.root, config.url.assets,
        config.url.stylesheets, src);
    }
  };
});