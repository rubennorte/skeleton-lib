
/*!
 * Skeleton.js - Skeleton
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  './model',
  './collection',
  './view',
  './i18n'
], function(Model, Collection, View, I18n){

  /**
   * Skeleton namespace
   */

  var Skeleton = {
    Model: Model,
    Collection: Collection,
    View: View,
    I18n: I18n
  };

  return Skeleton;

});