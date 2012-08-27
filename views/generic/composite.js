
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

    views: {},

    setView: function(selector, view){
      // Remove current subview if exists
      if (this.views[selector])
        this.views[selector].remove();

      this.views[selector] = view;
      this.refresh();
    },

    render: function(){
      var self = this;

      // Detach subviews
      _(this.views).each(function(view){
        view.$el.detach();
      });

      // Render template, delegate events, etc.
      // super.render();
      View.prototype.render.call(this);

      // Append subviews
      _(this.views).each(function(view, selector){
        self.$(selector).append(view.render().el);
      });

      return this;
    },

    remove: function(){
      // Remove sub-views
      _(this.views).each(function(view){
        view.remove();
      });

      // super.remove();
      View.prototype.remove.call(this);
    }
    
  });

  return CompositeView;

});