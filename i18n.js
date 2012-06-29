
/*!
 * Skeleton.js - I18n
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  'require',
  'config',
  'backbone',
  'underscore',
  'underscore.string',
  './util/url'
], function(require, config, Backbone, _, _s, URL){

  /**
   * Skeleton I18n module definition
   */
  var I18n = _.extend({}, Backbone.Events, {

    // Current locale
    _locale: null,

    // The object containing the current locale translations
    _translations: {},

    // The object containing counters for all missing translations
    _missingTranslations: {},
    
    /**
     * Translates the specified parameter.
     * If it's an object, we assume that the object keys are the language code
     * and the object values are the translations for that language.
     * Otherwise, search the translation for that key in the stored translations
     */
    t: function(text){

      // If the parameter is an object, get the translations from it according
      // to the current locale
      if (text && typeof(text) == 'object'){
        if (this._locale in text) text = text[this._locale];
        else text = text[config.i18n.defaultLocale];
      } else {
        // Search in translation object
        if (!this._translations[text] && !this._missingTranslations[text]){
          // The translation is not found, so increment the counter for that key
          // in the missing translations object
          this._missingTranslations[text] = (this._missingTranslations[text] || 0) + 1;
          this._translations[text] = text;
          console.info('I18n', 't', 'Missing translation for key', text);
        }

        // Set the translated text as the value in the translations object or
        // the translation key itself (if the translation is missing)
        text = this._translations[text] || text;
      }

      // If the key is not the only specified parameter, return interpolated
      if (arguments.length > 1)
        return _s.sprintf.apply(null, arguments);
      
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

    /**
     * Returns the current locale
     */
    getLocale: function(){
      return this._locale;
    },

    /**
     * Sets the current locale. The translation object can be passed or
     * it will be loaded from a JSON in the load path. When the locale is set
     * and the translations are loaded, callback function is invoked
     */
    setLocale: function(locale, translations, callback){
      // Check if translations object is defined
      if (typeof(translations) == 'function'){
        callback = translations;
        translations = null;
      }

      // TODO Add support for region localization
      locale = locale.substr(0,2).toLowerCase();

      // If the locale is the current one, return immediatelly
      if (locale == this.getLocale())
        return callback && callback();

      // If the translations are defined, we don't have to load them and can
      // set the locale inmediately
      if (translations){
        this._setLocaleAndTranslations(locale, translations, callback);
      } else {
        // Otherwise, we have to load them (as an AMD module to cache)
        var self = this;
        require(['json!' + this._getLocaleUrl(locale)], function(newTranslations){
          self._setLocaleAndTranslations(locale, newTranslations, callback);
        });
      }
    },

    // Returns the URL of the JSON containing the translations for the specified
    // locale
    _getLocaleUrl: function(locale){
      return URL.join(config.i18n.loadPath, locale + '.json');
    },

    // Assigns the locale, the translations object and invokes the callback
    _setLocaleAndTranslations: function(locale, translations, callback){
      if (this._locale != locale || !_.isEqual(this._translations, translations)){
        console.info('I18n', 'setLocale', 'Locale set to', locale);
        this._locale = locale;
        this._translations = translations;
        this._missingTranslations = {};
        this.trigger('change:locale', this);
      }
      callback && callback();
    }

  });

  // Bind all the public functions
  _.bindAll(I18n, 't', 'l', 'getLocale', 'setLocale');

  return I18n;

});
