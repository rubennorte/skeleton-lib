
/*!
 * Skeleton.js - ListView
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  '../view',
  'underscore'
], function(View, _){
  
  'use strict';

  var ListView = View.extend({

    constructor: function(){
      // super();
      View.apply(this, arguments);

      // Initialize _itemViews if it's not
      if (!this._itemViews) this._itemViews = [];

      _.defaults(this.options, {
        // Instances of this view class will be created for each model in the list
        ItemView: null,

        // jQuery-like selector where the item views will be appended to
        listSelector: null
      });

      // Create all the views for the list items
      this.createItemViews();

      // Bind events
      this.listenTo(this.collection, 'reset', this.onReset);
      this.listenTo(this.collection, 'add', this.onAdd);
      this.listenTo(this.collection, 'remove', this.onRemove);
    },

    doRender: function(){
      // Detach item view elements to keep event bindings
      _(this._itemViews).chain().pluck('$el').invoke('detach');

      // Render the list container, replacing the current view content
      this.renderContainer();

      // Populate the container with the list items
      this.populateList();
    },

    onReset: function(collection){
      // Remove all old item views
      _(this._itemViews).invoke('remove');

      // Create the new item views
      this.createItemViews();

      // Populate the list again (the old items were previously removed)
      if (this._rendered)
        this.populateList();
    },

    /**
     * Renders the list container. By default renders the template associated
     * with this view but the function can be redefined to render a custom
     * content
     */
    renderContainer: function(){
      this.renderTemplate();
    },

    /**
     * Creates a new item view for the specified model. By default uses the
     * ItemView option as the view class.
     * This function can be redefined to use a determined view depending on the
     * model itself
     */
    createItemView: function(model){
      return new this.options.ItemView({model: model});
    },

    /**
     * Create all the item views for the current collection models
     */
    createItemViews: function(){
      var self = this;
      this._itemViews = this.collection.map(function(model){
        return self.createItemView(model);
      });
    },

    /**
     * Appends the list items to the DOM element which corresponds to the list
     * container
     */
    populateList: function(){
      var list = this.getListElement();
      _(this._itemViews).each(function(itemView){
        list.append(itemView.render().$el);
      });
    },

    /**
     * Creates a item view associated with the new model, renders it and adds
     * it to the DOM at the proper position
     */
    onAdd: function(model, collection, options){
      var index = options.index;
      var itemView = this.createItemView(model);
      this._itemViews.splice(index, 0, itemView);
      if (this._rendered){
        itemView.render();
        if (index > 0){
          this._itemViews[index-1].$el.after(itemView.$el);
        } else {
          this.getListElement().append(itemView.$el);
        }
      }
    },

    /**
     * Removes the view corresponding to the removed model from the DOM and
     * the item view list
     */
    onRemove: function(model, collection, options){
      var index = options.index;
      var view = this._itemViews.splice(index, 1)[0];
      view.remove();
    },

    /**
     * Returns the element where the item views must be added
     */
    getListElement: function(){
      if (this.options.listSelector){
        return this.$(this.options.listSelector);
      }
      return this.$el;
    },

    /**
     * Remove the list and all its items
     */
    remove: function(){
      // Remove sub-views
      _(this._itemViews).invoke('remove');

      // super.remove();
      return View.prototype.remove.call(this);
    }

  });

  return ListView;

});