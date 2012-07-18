
/*!
 * Skeleton.js - CompositeView
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  '../../view',
  'underscore'
], function(View, _){
  
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

      // Detach subviews
      for (var i in this.views){
        this.views[i].$el.detach();
      }

      // Render template, delegate events, etc.
      // super.render();
      View.prototype.render.call(this);

      // Append subviews
      for (var i in this.views){
        this.$(i).append(this.views[i].render().el);
      }

      return this;
    },

    remove: function(){
      this._ensureViewsObject();

      // Remove sub-views
      for (var i in this.views){
        this.views[i].remove();
      }

      // super.remove();
      View.prototype.remove.call(this);
    },

    _ensureViewsObject: function(){
      this.views || (this.views = {});
    }
    
  });

  return CompositeView;

});