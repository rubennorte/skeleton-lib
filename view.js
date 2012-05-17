
/*!
 * Skeleton.js - View
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  'use!backbone',
  'use!underscore',
  'config',
  './i18n',
  './views/helpers/default',
  './views/template-engines/underscore'
], function(Backbone, _, Config, I18n, DefaultHelpers, UnderscoreTemplateEngine){

  var View = Backbone.View.extend({

    // Instance properties

    render: function(){
      this.renderTemplate();
      this.delegateEvents();
      this._rendered = true;
      return this;
    },

    renderIfRendered: function(){
      if (this._rendered)
        this.render();
      return this;
    },

    renderTemplate: function(template, locals, templateEngine){
      template || (template = this.template);
      
      if (template){

        locals || (locals = this.templateVars);
        templateEngine || (templateEngine = this.templateEngine);

        var content = View.renderTemplate(template, locals, templateEngine);
        this.$el.html(content);
      }
    }

  }, {

    // Class properties

    globals: _.defaults({}, DefaultHelpers),

    defaultTemplateEngine: UnderscoreTemplateEngine,
    
    renderTemplate: function(template, locals, templateEngine){

      // If templateEngine is not defined, use default
      templateEngine || (templateEngine = this.defaultTemplateEngine);

      // Merge local and global variables to construct the template context
      var context = _.defaults({}, locals, this.globals);

      return templateEngine.render(template, context);
    }

  });

  return View;
  
});