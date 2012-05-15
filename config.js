
/*!
 * Skeleton.js - config
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define(function(){

  var config = {};

  config.url = {};
  config.url.root = '/';
  config.url.assets = config.url.root + 'public/';
  config.url.images = config.url.assets + 'images/';
  config.url.stylesheets = config.url.assets + 'stylesheets/';
  
  config.i18n = {};
  config.i18n.loadPath = config.url.assets + 'data/locales/';
  config.i18n.defaultLocale = 'en';

  return config;

});