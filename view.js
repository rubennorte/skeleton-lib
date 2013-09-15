
/*!
 * Skeleton.js - View
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  'backbone',
  'underscore',
  './helpers/default',
  './template-engines/underscore'
], function(Backbone, _, DefaultHelpers, UnderscoreTemplateEngine){

  'use strict';

  /**
   * Skeleton view definition
   */
  var View = Backbone.View.extend({

    // Instance properties

    _rendered: false,
    template: null,
    templateVars: null,
    templateEngine: null,

    /**
     * Gets or sets the value of one o multiple template variables, e.g.,
     *   templateVar('name', 'value') => this
     *   templateVar({name: 'value', ...}) => this
     *   templateVar('name') => 'value'
     *   templateVar() => object with all template vars
     */
    templateVar: function(name, value){
      this.templateVars = this.templateVars || {};

      if (arguments.length === 0){
        return this.templateVars;
      }

      var singleArgument = arguments.length === 1;

      if (singleArgument && !_.isObject(name)){
        return this.templateVars[name];
      }

      if (singleArgument){
        _.extend(this.templateVars, name);
      } else {
        this.templateVars[name] = value;
      }

      return this;
    },

    /**
     * Backbone render redefined to render the specified template,
     * delegate the events and set the _rendered flag as true
     */
    render: function(){
      this._preRender();
      this._doRender();
      this.delegateEvents();
      this._postRender();
      return this;
    },

    /**
     * Triggers the "render:before" event
     */
    _preRender: function(){
      this.trigger('render:before', this);
      return this;
    },

    /**
     * Renders the view
     */
    _doRender: function(){
      this.renderTemplate();
      return this;
    },

    /**
     * Marks the view as rendered and triggers the "render" event
     */
    _postRender: function(){
      this._rendered = true;
      this.trigger('render', this);
      _.defer(_.bind(this.trigger, this, 'render:after', this));
      return this;
    },

    /**
     * Indicates whether the view has been rendered
     */
    isRendered: function(){
      return this._rendered;
    },

    /**
     * Renders the view if it was already rendered
     */
    refresh: function(){
      if (this.isRendered()){
        this.render();
      }
      return this;
    },

    /**
     * Renders the specified template (or the view template), with the specified
     * local variables (or the specified in view templateVars object)
     * and template engine (or the default engine)
     */
    renderTemplate: function(template, locals, templateEngine){
      template = template || this.template;
      
      if (template){
        locals = locals || this.templateVars;
        templateEngine = templateEngine || this.templateEngine;

        // Add view as templateVar by default
        if (locals && !_.has(locals, 'view')){
          locals.view = this;
        }

        var content = View.renderTemplate(template, locals, templateEngine);
        this.$el.html(content);
      }

      return this;
    },

    /**
     * Removes the view from the DOM and releases all references
     */
    remove: function(){
      // Remove element from DOM
      this.$el.remove();

      if (!this._removed){ // Avoid infinite recursion
        this._removed = true;
        this.trigger('remove', this);
      }

      this.stopListening();
      this.dispose();

      return this;
    },

    /**
     * Indicates whether the view has been removed
     */
    isRemoved: function(){
      return this._removed;
    },

    /**
     * Remove all event listeners (other than bound with listenTo)
     * and used resources
     */
    dispose: function(){},

    /**
     * Backbone _configure function redefined to attach the template
     * option directly to the view
     */
    _configure: function(){
      // super._configure();
      Backbone.View.prototype._configure.apply(this, arguments);

      if (this.options.template){
        this.template = this.options.template;
      }
    }

  }, {

    // Class properties

    /**
     * Global template variables. Includes default view helpers
     */
    globals: _.defaults({}, DefaultHelpers),

    /**
     * Default template engine for all views. By default, UTE
     */
    defaultTemplateEngine: UnderscoreTemplateEngine,

    /**
     * Compiles the specified template with the specified template engine
     * (or the default one)
     */
    compileTemplate: function(template, templateEngine){

      // If templateEngine is not defined, use default one
      templateEngine = templateEngine || this.defaultTemplateEngine;

      return templateEngine.compile(template);
    },
    
    /**
     * Renders the specified template with the specified locals and template
     * engine (or the default one)
     */
    renderTemplate: function(template, locals, templateEngine){

      // If templateEngine is not defined, use default
      templateEngine = templateEngine || this.defaultTemplateEngine;

      // Merge local and global variables to construct the template context
      var context = _.defaults({}, locals, this.globals);

      // Return template rendered with the proper engine and context
      return templateEngine.render(template, context);
    }

  });

  return View;
  
});