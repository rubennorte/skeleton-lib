
/*!
 * Skeleton.js - ListView
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  '../../view',
  'underscore'
], function(View, _){
  
  var ListView = View.extend({

    /*
     *  Available options:
     *
     *    collection,   (required)
     *    ItemView,     (required)
     *    template,
     *    locals,
     *    listSelector,
     *    refreshItemsOnly
     */

    initialize: function(){
      console.trace('ListView', 'initialize', this);

      this.createItemViews();
      this.collection.on('reset', this.onReset, this);
      this.collection.on('add', this.onAdd, this);
      this.collection.on('remove', this.onRemove, this);
    },

    render: function(){
      console.trace('ListView', 'render', this);

      if (this._rendered && this.options.refreshItemsOnly){
        this.itemViews.invoke('render');
      } else {
        // To keep event bindings
        this.itemViews.pluck('$el').invoke('detach');
        this.$el.empty();

        this.renderContainer();

        this.populateList();

        this._rendered = true;
      }
      
      return this;
    },

    onReset: function(collection){
      this.itemViews.invoke('remove');
      this.createItemViews();
      if (this._rendered)
        this.populateList();
    },

    renderContainer: function(){
      this.renderTemplate();
    },

    createItemView: function(model){
      return new this.options.ItemView({model: model});
    },

    createItemViews: function(){
      var self = this;
      this.itemViews = _.chain(this.collection.map(function(model){
        return self.createItemView(model);
      }));
    },

    populateList: function(){
      var list = this.getListElement();
      this.itemViews.each(function(itemView){
        list.append(itemView.render().$el);
      });
    },

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

    // Removes the view corresponding to the removed model.
    onRemove: function(model, collection, options){
      var index = options.index;
      var view = this.itemViews.value().splice(index, 1)[0];
      view.remove();
    },

    getListElement: function(){
      if (this.options.listSelector){
        return this.$(this.options.listSelector);
      }
      return this.$el;
    },

    remove: function(){
      this.unbindEvents();
      
      // super.remove();
      View.prototype.apply(this, arguments);
    },

    unbindEvents: function(){
      // Remove all event handlers with this context
      this.collection.off(null, null, this);
    }

  });

  return ListView;

});