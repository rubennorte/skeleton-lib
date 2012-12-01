
/*!
 * Skeleton.js - config
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  'underscore',
  './util/url'
], function(_, URL){

  'use strict';

  var config = {};

  function join(part1, part2){
    part1 = typeof part1 === 'function' ? part1() : part1;
    return URL.join(part1, part2);
  }

  // URL related config
  config.url = {};
  config.url.root = '/';
  config.url.assets = function(){ return join(config.url.root, 'assets'); };
  config.url.images = function(){ return join(config.url.assets, 'images'); };
  config.url.stylesheets = function(){ return join(config.url.assets, 'stylesheets'); };

  config.url.backend = '/';
  
  // I18n config
  config.i18n = {};
  config.i18n.loadPath = 'locales';
  config.i18n.defaultLocale = 'en';
  config.i18n.locale = 'en';
  config.i18n.availableLocales = null;

  // Log config
  config.log = {};
  config.log.level = 'error';

  return config;

});