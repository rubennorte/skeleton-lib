
/*!
 * Skeleton.js - MasterDetailView
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */
 
define([
  './list',
  'underscore'
], function(ListView, _){
  
  'use strict';
  
  /**
   * Skeleton master-detail view definition
   */
  var MasterDetailView = ListView.extend({

    /**
     * Initializes the master-detail view
     * The available options are (additionally to the list view options):
     * - DetailView (required)      View class for the selected items
     * - detailSelector (required)  jQuery selector to determine which element
     *                              will be the detail views displayed in
     * - cacheViews                 Determines if the detail views must be
                                    cached (default: false)
     * - visibilityAttr             Determines which attribute of the models
     *                              will determine that it's selected
     *                              (default: 'visible')
     */
    initialize: function(){
      //super.initialize();
      ListView.prototype.initialize.apply(this, arguments);

      _.defaults(this.options, {
        visibilityAttr: 'visible',
        cacheViews: false
      });
      
      if (this.options.cacheViews){
        this.detailViews = _.chain([]);
        this.collection.on('reset', this.resetCache, this);
        this.collection.on('remove', this.removeDetailViewFromCache, this);
        this.collection.on('change:'+this.options.visibilityAttr,
          this.changeVisibleCache, this);
        // It's not needed to bind an event when an element is added to the list
        // because it is handled when shown.
      } else {
        this.collection.on('change:'+this.options.visibilityAttr,
          this.changeVisible, this);
      }
      
      this.collection.on('remove', this.removeDetailView, this);
    },

    render: function(){
      // Render template and list items
      //super.render();
      ListView.prototype.render.apply(this, arguments);

      this.showCurrent();

      this._rendered = true;
      return this;
    },

    changeVisible: function(model, visible){
      if (visible){
        // Remove previous detail view
        if (this.detailView){
          this.detailView.model.set({visible: false});
          this.detailView.remove();
        }
        // Create and render the new one
        this.detailView = new this.options.DetailView({model: model});
        this.showCurrent();
      }
    },

    changeVisibleCache: function(model, visible){
      if (visible){
        // Hide previous detail view
        if (this.detailView){
          this.detailView.model.set({visible: false});
        }
        // Create or restore and render the new visible one
        this.detailView = this.detailViews.find(function(detailView){
          return detailView.model == model;
        }).value();
        if (!this.detailView){
          this.detailView = new this.options.DetailView({model: model});
          this.detailViews.value().push(this.detailView);
        }
        this.showCurrent();
      }
    },

    resetCache: function(){
      this.detailViews.invoke('remove');
      this.detailViews = _.chain([]);
    },

    removeDetailViewFromCache: function(model){
      var detailViews = this.detailViews.value();
      for (var i=0; i<detailViews.length; i++){
        if (detailViews[i].model == model){
          detailViews[i].remove();
          detailViews.splice(i, 1);
          return;
        }
      }
    },

    removeDetailView: function(model){
      if (this.detailView && this.detailView.model == model){
        this.detailView.remove();
        this.detailView = null;
      }
    },

    showCurrent: function(){
      if (this.detailView && this._rendered){
        var detailContainer = this.$(this.options.detailSelector);
        detailContainer.append(this.detailView.render().el);
      }
    }

  });

  return MasterDetailView;

});