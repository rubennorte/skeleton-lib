
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
], function(require, config, Backbone, _, _s, url){

  'use strict';

  var rLocale = /^([a-zA-Z]{2})([\-_]([a-zA-Z]{2}))?$/,
      rStrictLocale = /^([a-z]{2})([_]([A-Z]{2}))?$/;

  var LOCALE_FORMAT_ERROR = 'The locale must have a valid format ' +
    '(e.g. en, es_ES)';

  // Ensure i18n configuration object is defined
  config.i18n = _.defaults({}, config.i18n, {
    defaultLocale: 'en',
    availableLocales: null
  });

  /**
   * Skeleton I18n module definition
   */
  var I18n = _.extend({}, Backbone.Events, {

    // Current locale
    _locale: null,

    // Default locale
    _defaultLocale: config.i18n.defaultLocale,

    // The object containing the current locale translations
    _translations: {},

    // The object containing counters for all missing translations
    _missingTranslations: {},

    // List of all available locales.
    // If null, the existence of each locale file is not verified before
    // trying to load it
    _availableLocales: config.i18n.availableLocales,
    
    /**
     * Translates the specified parameter.
     * If it's an object, we assume that the object keys are the language code
     * and the object values are the translations for that language.
     * Otherwise, search the translation for that key in the stored translations
     */
    t: function(text){

      switch (typeof(text)){
        case 'string':
        case 'number':
        case 'boolean':
          
          if (typeof(text) === 'number') text = '' + text;
          else if (typeof(text) === 'boolean') text = text ? 'true' : 'false';

          // If text is a string, search in translation object
          if (!this._translations[text] && !this._missingTranslations[text]){
            // The translation is not found, so increment the counter for
            // that key in the missing translations object
            this._missingTranslations[text] =
              (this._missingTranslations[text] || 0) + 1;
            this._translations[text] = text;
            console.info('skeleton/i18n', 'Missing translation for key', text);
          }

          // Set the translated text as the value in the translations object or
          // the translation key itself (if the translation is missing)
          text = this._translations[text] || text;
          break;

        case 'object':
          // If text is an object, get the translations from it according
          // to the current locale
          if (this._locale in text) text = text[this._locale];
          else text = text[this._defaultLocale];
          break;

        case 'function':
          // If text is a function, get the result of this function passing
          // the locale as a parameter
          text = text(this._locale);
          break;

        default:
          throw new Error('String or object parameter expected');
      }

      // If the key is not the only specified parameter, return interpolated
      if (arguments.length > 1)
        return _s.sprintf.apply(null, arguments);
      
      return text;
    },

    /**
     * Returns the default locale according to the information provided
     * by the navigator
     */
    getUserDefaultLocale: function(){
      var locale;

      if (!navigator) return;

      // Android fix
      if (navigator.userAgent &&
        (locale = navigator.userAgent.match(/android.*\W(\w\w)-(\w\w)\W/i)))
        return locale;

      return navigator.language;
    },

    getDefaultLocale: function(){
      return this._defaultLocale;
    },

    /**
     * Returns the current locale
     */
    getLocale: function(){
      return this._locale;
    },

    /**
     * Returns the current language
     */
    getLanguage: function(){
      return this._locale.substr(0,2);
    },

    /**
     * Returns the current region
     */
    getRegion: function(){
      return this._locale.substr(3,2);
    },

    /**
     * Returns true if exists any valid locale file for the specified locale
     */
    isLocaleAvailable: function(locale){
      if (!this._availableLocales) return undefined;

      var language = locale.substr(0,2),
          languageAvailable = _(this.availableLocales).include(language);

      if (languageAvailable) return true;

      return locale.length === 5 && _(this.availableLocales).include(locale);
    },

    /**
     * Sets the current locale. The translation object can be passed or
     * it will be loaded from a JSON in the load path. When the locale is set
     * and the translations are loaded, callback function is invoked
     */
    setLocale: function(locale, translations, callback){
      if (!rLocale.test(locale))
        throw new Error(LOCALE_FORMAT_ERROR + ': ' + locale);

      locale = toPOSIXLocale(locale);

      // Check if translations object is defined
      if (typeof(translations) === 'function'){
        callback = translations;
        translations = null;
      }

      // If the locale is the current one, return immediatelly
      if (locale === this.getLocale())
        return callback && callback();

      if (translations){
        // If the translations are defined, we don't have to load them and can
        // set the locale inmediately
        this._setLocaleAndTranslations(locale, translations, callback);
      } else {
        // Otherwise, we have to load them (as AMD modules to cache)
        var language = locale.substr(0,2),
            region = locale.substr(3,2),
            localeFiles = [];

        if (!this._availableLocales ||
          _(this._availableLocales).include(language))
          localeFiles.push('json!' + this._getLocaleUrl(language));

        if (region &&
          (!this._availableLocales || (this._availableLocales).include(locale)))
          localeFiles.push('json!' + this._getLocaleUrl(locale));

        if (localeFiles.length === 0){
          if (callback)
            callback('The specified locale is not available: ' + locale);
          return false;
        }

        var self = this;
        require(localeFiles, function(){
          var translations = {};
          _.each(arguments, function(current){
            translations = _.extend(translations, current);
          });
          self._setLocaleAndTranslations(locale, translations, callback);
        }, function(err){
          if (callback)
            callback('Any translation file cannot be loaded');
        });
      }
    },

    /**
     * Sets the available locale files in the project
     */
    setAvailableLocales: function(availableLocales){
      _(availableLocales).each(function(availableLocale){
        if (!rStrictLocale.test(availableLocale))
          throw new Error(LOCALE_FORMAT_ERROR + ': ' + availableLocale);
      });
      var prevAvailableLocales = this._availableLocales;
      this._availableLocales = availableLocales;
      this.trigger('change:availableLocales', this, availableLocales, prevAvailableLocales);
    },

    /**
     * Sets the default locale
     */
    setDefaultLocale: function(locale){
      if (!rStrictLocale.test(locale))
        throw new Error(LOCALE_FORMAT_ERROR + ': ' + locale);

      var prevLocale = this._defaultLocale;
      this._defaultLocale = locale;
      this.trigger('change:defaultLocale', this, locale, prevLocale);
    },

    // Returns the URL of the JSON containing the translations for the specified
    // locale
    _getLocaleUrl: function(locale){
      return url.join(config.i18n.loadPath, locale + '.json');
    },

    // Assigns the locale, the translations object and invokes the callback
    _setLocaleAndTranslations: function(locale, translations, callback){
      if (this._locale !== locale || !_.isEqual(this._translations, translations)){
        console.info('skeleton/i18n', 'Locale set to', locale);
        this._locale = locale;
        this._translations = translations;
        this._missingTranslations = {};
        this.trigger('change:locale', this);
      }
      if (callback) callback(null, locale);
    }

  });

  function toPOSIXLocale(locale){
    if (!locale)
      return locale;

    if (locale.length === 2)
      return locale.toLowerCase();
    
    return locale.substr(0,2).toLowerCase() + '_' +
      locale.substr(3,2).toUpperCase();
  }

  return I18n;

});
