
/*!
 * Skeleton.js - CompositeView
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  '../../view',
  'underscore'
], function(View, _){
  
  'use strict';
  
  var CompositeView = View.extend({

    setView: function(selector, view){
      this._ensureViewsObject();

      // Remove current subview if exists
      if (this.views[selector])
        this.views[selector].remove();

      this.views[selector] = view;
      this.refresh();
    },

    render: function(){
      this._ensureViewsObject();

      var self = this;

      // Detach subviews
      _(this.view).each(function(view){
        view.$el.detach();
      });

      // Render template, delegate events, etc.
      // super.render();
      View.prototype.render.call(this);

      // Append subviews
      _(this.view).each(function(view, selector){
        self.$(selector).append(view.render().el);
      });

      return this;
    },

    remove: function(){
      this._ensureViewsObject();

      // Remove sub-views
      _(this.views).each(function(view){
        view.remove();
      });

      // super.remove();
      View.prototype.remove.call(this);
    },

    _ensureViewsObject: function(){
      this.views || (this.views = {});
    }
    
  });

  return CompositeView;

});