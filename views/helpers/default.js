
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

  return {

    config: config,

    _: _,

    t: I18n.t,
    l: I18n.l,

    text: textUtils,

    urlTo: function(dst){
      return url.join(config.url.root, dst);
    },

    assetUrl: function(src){
      return url.join(config.url.assets, src);
    },

    imageUrl: function(src){
      return url.join(config.url.images, src);
    },

    stylesheetUrl: function(src){
      return url.join(config.url.stylesheets, src);
    }
  };
});