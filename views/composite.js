
/*!
 * Skeleton.js - CompositeView
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  '../view',
  'underscore'
], function(View, _){
  
  'use strict';
  
  var CompositeView = View.extend({

    constructor: function(){
      // super();
      View.apply(this, arguments);
 
      // Initialize views object
      if (!this.views){
        this.views = {};
      }
    },

    getView: function(selector){
      return this.views[selector];
    },

    setView: function(selector, view){
      // Remove current subview if exists
      if (this.views[selector]){
        this.views[selector].remove();
      }

      if (view){
        this.views[selector] = view;
      } else {
        delete this.views[selector];
      }

      this.refresh();
    },

    removeView: function(selectorOrView){
      if (_.isString(selectorOrView)){
        this.setView(selectorOrView, null);
      } else {
        _.find(this.views, function(view, selector){
          if (view === selectorOrView){
            this.setView(selector, null);
            return true;
          }
        });
      }
    },

    doRender: function(){
      // Detach subviews
      _(this.views).each(function(view){
        view.$el.detach();
      });

      View.prototype.doRender.call(this);

      // Append subviews
      _(this.views).each(this.appendView, this);
    },

    appendView: function(view, selector){
      this.$(selector).append(view.render().el);
    },

    remove: function(){
      // Remove sub-views
      _(this.views).invoke('remove');

      // super.remove();
      return View.prototype.remove.call(this);
    }
    
  });

  return CompositeView;

});