
/*!
 * Skeleton.js - DefaultHelpers
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  'config',
  'use!underscore',
  '../../i18n',
  '../../util/text',
  '../../util/url'
], function(config, _, I18n, textUtils, url){

  function joinUntilHost(){
    var fragment,
        fragments = _(arguments).toArray(),
        urlStr = '';
    while (fragment = fragments.pop()){
      var parsed = url.parseUri(fragment);
      if (parsed.host) return url.join(fragment, urlStr);
      else urlStr = url.join(fragment, urlStr);
    }
    return urlStr;
  }

  return {

    config: config,

    _: _,

    t: I18n.t,
    l: I18n.l,

    text: textUtils,

    urlTo: function(dst){
      return joinUntilHost(config.url.root, dst);
    },

    assetUrl: function(src){
      return joinUntilHost(config.url.root, config.url.assets, src);
    },

    imageUrl: function(src){
      return joinUntilHost(config.url.root, config.url.assets,
        config.url.images, src);
    },

    stylesheetUrl: function(src){
      return joinUntilHost(config.url.root, config.url.assets,
        config.url.stylesheets, src);
    }
  };
});