
/*!
 * Skeleton.js - View
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  'backbone',
  'underscore',
  'config',
  './i18n',
  './views/helpers/default',
  './views/template-engines/underscore'
], function(Backbone, _, Config, I18n, DefaultHelpers, UnderscoreTemplateEngine){

  'use strict';

  /**
   * Skeleton view definition
   */
  var View = Backbone.View.extend({

    // Instance properties

    _rendered: false,
    template: null,
    templateVars: {},
    templateEngine: null,

    /**
     * Backbone render redefined to render the specified template,
     * delegate the events and set the _rendered flag as true
     */
    render: function(){
      this.renderTemplate();
      this.delegateEvents();
      this._rendered = true;
      return this;
    },

    /**
     * Renders the view if it was already rendered
     */
    refresh: function(){
      if (this._rendered)
        this.render();
      return this;
    },

    /**
     * Renders the specified template (or the view template), with the specified
     * local variables (or the specified in view templateVars object)
     * and template engine (or the default engine)
     */
    renderTemplate: function(template, locals, templateEngine){
      template || (template = this.template);
      
      if (template){

        locals || (locals = this.templateVars);
        templateEngine || (templateEngine = this.templateEngine);

        var content = View.renderTemplate(template, locals, templateEngine);
        this.$el.html(content);
      }
    },

    /**
     * Removes the view from the DOM and unbinds the attached event handlers
     */
    remove: function(){
      this.unbindEvents();
      return Backbone.View.prototype.remove.call(this);
    },

    /**
     * Unbinds all events bound with the context of this view
     */
    unbindEvents: function(){
      if (this.model) this.model.off(null, null, this);
      if (this.collection) this.collection.off(null, null, this);
    },

    /**
     * Backbone _configure function redefined to attach the template
     * option directly to the view
     */
    _configure: function(){
      // super._configure();
      Backbone.View.prototype._configure.apply(this, arguments);

      if (this.options.template && !this.template){
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
      templateEngine || (templateEngine = this.defaultTemplateEngine);

      return templateEngine.compile(template);
    },
    
    /**
     * Renders the specified template with the specified locals and template
     * engine (or the default one)
     */
    renderTemplate: function(template, locals, templateEngine){

      // If templateEngine is not defined, use default
      templateEngine || (templateEngine = this.defaultTemplateEngine);

      // Merge local and global variables to construct the template context
      var context = _.defaults({}, locals, this.globals);

      // Return template rendered with the proper engine and context
      return templateEngine.render(template, context);
    }

  });

  return View;
  
});