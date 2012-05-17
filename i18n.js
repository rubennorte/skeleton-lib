
/*!
 * Skeleton.js - I18n
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  'require',
  'config',
  'use!backbone',
  'use!underscore',
  './util/text',
  './util/url'
], function(require, config, Backbone, _, Text, URL){

  var I18n = _.extend({}, Backbone.Events, {

    _locale: null,
    _translations: {},
    _missingTranslations: {},
    
    // Translate function
    t: function(text){

      if ('object' == typeof(text)){
        // Translations present in parameter
        if (this._locale in text) text = text[this._locale];
        else text = text[config.i18n.defaultLocale];
      } else {
        // Search in translation object
        if (!this._translations[text] && !this._missingTranslations[text]){
          this._missingTranslations[text] = (this._missingTranslations[text] || 0) + 1;
          this._translations[text] = text;
          console.info('I18n', 't', 'Missing translation for key "%s"', text);
        }
        text = this._translations[text] || text;
      }

      if (arguments.length > 1)
        return Text.sprintf.apply(null, arguments);
      
      return text;
    },

    // Localize function (for dates)
    // TODO
    l: function(dateTime){
      // Convert into a date object if it's not
      if (!(dateTime instanceof Date))
        dateTime = new Date(dateTime);
      return dateTime.toString();
    },

    getLocale: function(){
      return this._locale;
    },

    setLocale: function(locale, translations, callback){
      if (typeof(translations) == 'function'){
        callback = translations;
        translations = null;
      }

      // TODO
      locale = locale.substr(0,2).toLowerCase();

      if (translations){
        this._setLocaleAndTranslations(locale, translations, callback);
      } else {
        var self = this;
        require(['json!' + this._getLocaleUrl(locale)], function(newTranslations){
          self._setLocaleAndTranslations(locale, newTranslations, callback);
        });
      }
    },

    _getLocaleUrl: function(locale){
      return URL.join(config.i18n.loadPath, locale + '.json');
    },

    _setLocaleAndTranslations: function(locale, translations, callback){
      if (this._locale != locale || !_.isEqual(this._translations, translations)){
        console.info('I18n', 'setLocale', 'Locale set to "%s"', locale);
        this._locale = locale;
        this._translations = translations;
        this._missingTranslations = {};
        this.trigger('change:locale', this);
      }
      callback && callback();
    }

  });

  _.bindAll(I18n, 't', 'l', 'getLocale', 'setLocale');

  return I18n;

});
