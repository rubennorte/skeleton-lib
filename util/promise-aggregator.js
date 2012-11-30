
/*!
 * Skeleton.js - PromiseAggregator
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define(function(){

  'use strict';

  function PromiseAggregator(){
    this._promises = [];
  }

  PromiseAggregator.prototype.add = function(promise){
    this._promises.push(promise);
  };

  PromiseAggregator.prototype.all = function(){
    return this._promises;
  };

  return PromiseAggregator;

});