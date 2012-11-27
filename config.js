
/*!
 * Skeleton.js - config
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define(function(){

  'use strict';

  var config = {};

  // URL related config
  config.url = {};
  config.url.root = '/';
  config.url.assets = config.url.root + 'assets/';
  config.url.images = config.url.assets + 'images/';
  config.url.stylesheets = config.url.assets + 'stylesheets/';

  config.url.backend = '/';
  
  // I18n related config
  config.i18n = {};
  config.i18n.loadPath = 'locales';
  config.i18n.defaultLocale = 'en';

  // Log config
  config.log = {};
  config.log.level = 4; // ERROR

  return config;

});