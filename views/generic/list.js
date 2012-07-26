
/*!
 * Skeleton.js - ListView
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  '../../view',
  'underscore'
], function(View, _){
  
  'use strict';
  
  /**
   * Skeleton list view definition
   */
  var ListView = View.extend({

    /**
     * Initializes the list view
     * The available options are:
     * - collection (required)  Collection which is represented by the list
     * - ItemView (required)    View class for the list items
     * - listSelector           jQuery selector to determine which element will
     *                          be the items appended to (default: root element)
     */
    initialize: function(){
      console.trace('ListView', 'initialize', this);

      // Create all the views for the list items
      this.createItemViews();
      // Bind events
      this.collection.on('reset', this.onReset, this);
      this.collection.on('add', this.onAdd, this);
      this.collection.on('remove', this.onRemove, this);
    },

    render: function(){
      console.trace('ListView', 'render', this);

      // Detach item view elements to keep event bindings
      this.itemViews.pluck('$el').invoke('detach');

      // Empty this view
      this.$el.empty();

      // Render the list container
      this.renderContainer();

      // Populate the container with the list items
      this.populateList();

      this._rendered = true;
      
      return this;
    },

    onReset: function(collection){
      // Remove all old item views
      this.itemViews.invoke('remove');
      // Create the new item views
      this.createItemViews();

      // Populate the list again (the old items were previouslyremoved)
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
      this.itemViews = _.chain(this.collection.map(function(model){
        return self.createItemView(model);
      }));
    },

    /**
     * Appends the list items to the DOM element which corresponds to the list
     * container
     */
    populateList: function(){
      var list = this.getListElement();
      this.itemViews.each(function(itemView){
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
      this.itemViews.value().splice(index, 0, itemView);
      if (this._rendered){
        itemView.render();
        if (index > 0){
          this.itemViews.value()[index-1].$el.after(itemView.$el);
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
      var view = this.itemViews.value().splice(index, 1)[0];
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
     * Removes this view from the DOM and unbind all events
     */
    remove: function(){
      this.unbindEvents();
      
      // super.remove();
      View.prototype.remove.apply(this, arguments);
    },

    unbindEvents: function(){
      // Remove all event handlers bind to this context
      this.collection.off(null, null, this);
    }

  });

  return ListView;

});