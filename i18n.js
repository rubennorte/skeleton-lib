
/*!
 * Skeleton.js - I18n
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  'backbone',
  'underscore',
  'underscore.string',
  './util/url',
  'q',
  'jquery'
], function(Backbone, _, _s, url, Q, $){

  'use strict';

  var TAG = 'skeleton/i18n';

  var rLocale = /^([a-zA-Z]{2})([\-_]?([a-zA-Z]{2}))?/;

  var LOCALE_FORMAT_ERROR = 'The locale must have a valid format (e.g. "en", "es_ES")';

  /**
   * Skeleton I18n module definition
   */
  var I18n = _.extend({}, Backbone.Events, {

    // Current locale
    _locale: null,

    // Default locale
    _defaultLocale: null,

    // The object containing the current locale translations
    _translations: {},

    // The object containing counters for all missing translations
    _missingTranslations: {},

    // List of all available locales.
    // If null, the existence of each locale file is not verified before
    // trying to load it
    _availableLocales: null,

    // Relative path to the locale directory
    _loadPath: '',

    /**
     * Translates a string interpreted as a key in the translations object
     */
    translateString: function(str){
      str = str || 'undefined';
      var result = this._translations[str];
      if (!result && !this._missingTranslations[str]){
        // The translation is not found, so increment the counter for
        // that key in the missing translations object
        this._missingTranslations[str] =
          (this._missingTranslations[str] || 0) + 1;
        console.info(TAG, 'Missing translation for key', str);
      }
      str = result || str;
      arguments[0] = str;
      return this.interpolate.apply(this, arguments);
    },

    /**
     * Translates an object, returning the value for the current
     * locale or language used as key
     */
    translateObject: function(obj){
      var locale = this.getLocale();
      var language = this.getLanguage();
      if (!obj){
        return obj;
      } else if (_.has(obj, locale)){
        obj = obj[locale];
      } else if (_.has(obj, language)){
        obj = obj[language];
      } else if (_.has(obj, this._defaultLocale)){
        obj = obj[this._defaultLocale];
      } else {
        return null;
      }
      arguments[0] = obj;
      return this.interpolate.apply(this, arguments);
    },

    /**
     * Translates a boolean, searching the key "true" or "false" in the
     * translations object
     */
    translateBoolean: function(bool){
      bool = String(!!bool);
      return this.translateString.apply(this, arguments);
    },

    /**
     * Translates a number, searching the number as a key in the translations
     * object
     */
    translateNumber: function(number){
      number = String(number);
      return this.translateString.apply(this, arguments);
    },

    /**
     * Returns the result of the given function using the current locale as
     * a parameter
     */
    translateFunction: function(fn){
      arguments[0] = fn.apply(this, [this._locale].concat(arguments));
      return this.interpolate.apply(this, arguments);
    },

    /**
     * Interpolates the given string with the rest of parameters
     */
    interpolate: function(str){
      if (arguments.length > 1){
        return _s.sprintf.apply(null, arguments);
      }
      return str;
    },
    
    /**
     * Translates the specified parameter, determining it's type and calling
     * the proper function (translateString, translateObject...)
     */
    t: function(value){
      switch (typeof value){
      case 'string':
        return this.translateString.apply(this, arguments);
      case 'object':
        return this.translateObject.apply(this, arguments);
      case 'function':
        return this.translateFunction.apply(this, arguments);
      case 'number':
        return this.translateNumber.apply(this, arguments);
      case 'boolean':
        return this.translateBoolean.apply(this, arguments);
      default:
        return value;
      }
    },

    /**
     * Returns the system locale according to the information provided
     * by the navigator
     */
    getNavigatorLocale: function(fn){
      var deferred = Q.defer();
      var promise = deferred.promise;
      promise.nodeify(fn);

      if (typeof navigator === 'undefined'){
        deferred.resolve(this.getDefaultLocale());
      } else if (navigator.globalization && _.isFunction(navigator.globalization.getLocaleName)){
        // Cordova/Phonegap support
        navigator.globalization.getLocaleName(deferred.resolve,
            returnNavigatorLanguage(deferred));
      } else {
        returnNavigatorLanguage(deferred);
      }

      return promise;
    },

    getSystemLocale: function(){
      console.warn(TAG, 'getSystemLocale is deprecated and will be removed. ' +
          'Use getNavigatorLocale instead');
      return this.getNavigatorLocale();
    },

    /**
     * Returns the default locale
     */
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
     * Returns the language of the specified locale or the current one
     */
    getLanguage: function(locale){
      var loc = locale ? this._tryConvertLocale(locale) : this._locale;
      return loc && loc.substr(0,2);
    },

    /**
     * Returns the region of the specified locale or the current one
     */
    getRegion: function(locale){
      var loc = locale ? this._tryConvertLocale(locale) : this._locale;
      return loc && (loc.substr(3,2) || undefined);
    },

    /**
     * Returns true if exists any valid locale file for the specified locale
     */
    isLocaleAvailable: function(locale){
      var available = this._availableLocales;
      if (!available){
        return undefined;
      }

      var loc = this._convertLocale(locale);
      var language = this.getLanguage(loc);
      return _.include(available, language) || _.include(available, loc);
    },

    /**
     * Sets the current locale. The translation object can be passed or
     * it will be loaded from a JSON in the load path. When the locale is set
     * and the translations are loaded, callback function is invoked
     */
    setLocale: function(locale, translations, callback){
      // Check optional translations argument
      if (_.isFunction(translations)){
        callback = translations;
        translations = null;
      }

      var deferred = Q.defer();
      var promise = deferred.promise;
      promise.nodeify(callback);

      var loc = this._tryConvertLocale(locale);

      // Check locale format
      if (!loc){
        deferred.reject(new Error(LOCALE_FORMAT_ERROR + ': ' + locale));
        return promise;
      }

      // If the locale is the current one, return immediatelly
      if (loc === this.getLocale()){
        deferred.resolve();
        return promise;
      }

      // If the translations are defined, we don't have to load them and can
      // set the locale inmediately
      if (translations){
        this._setLocaleAndTranslations(loc, translations);
        deferred.resolve();
        return promise;
      }

      // Load translations from files
      var localeFiles = this.getPathsForLocale(loc);
      if (localeFiles.length === 0){
        deferred.reject(new Error('The specified locale is not available: ' + loc));
        return promise;
      }

      return this._loadLocaleFiles(loc, localeFiles, callback).nodeify(callback);
    },

    /**
     * Sets the available locale files in the project
     */
    setAvailableLocales: function(available){
      var self = this;
      available = _.map(available, _.bind(this._convertLocale, this));
      var prevAvailable = this._availableLocales;
      this._availableLocales = available;
      this.trigger('change:availableLocales', this, available, prevAvailable);
    },

    /**
     * Sets the default locale
     */
    setDefaultLocale: function(locale){
      var loc = this._convertLocale(locale);
      var prevLocale = this._defaultLocale;
      this._defaultLocale = loc;
      this.trigger('change:defaultLocale', this, locale, prevLocale);
    },

    /**
     * Sets the locale file load path
     */
    setLoadPath: function(path){
      this._loadPath = path;
    },

    /**
     * Returns a list of files that contains the translations for
     * the specified locale
     */
    getPathsForLocale: function(locale){
      var language = this.getLanguage(locale);
      var region = this.getRegion(locale);
      var available = this._availableLocales;
      var localeFiles = [];

      if (!available || _.include(available, language)){
        localeFiles.push(this.getPathForLocale(language));
      }

      if (!available || _.include(available, locale)){
        localeFiles.push(this.getPathForLocale(locale));
      }

      return localeFiles;
    },

    // Returns the URL of the JSON containing the translations for the specified
    // locale
    getPathForLocale: function(locale){
      return url.join(_.result(this, '_loadPath'), locale + '.json');
    },

    // Assigns the locale, the translations object and invokes the callback
    _setLocaleAndTranslations: function(locale, translations){
      if (this._locale !== locale || !_.isEqual(this._translations, translations)){
        console.info(TAG, 'Locale set to', locale);
        this._locale = locale;
        this._translations = translations;
        this._missingTranslations = {};
        this.trigger('change:locale', this);
      }
    },

    // Loads the locale files and merges the translation objects
    // into one
    _loadLocaleFiles: function(locale, localeFiles){
      var self = this;
      var requests = _.map(localeFiles, _.bind(this._loadLocaleFile, this));
      return Q.all(requests).then(function(results){
        results.unshift({});
        var translations = _.extend.apply(_, results);
        self._setLocaleAndTranslations(locale, translations);
      });
    },

    _loadLocaleFile: function(localeFile){
      return $.getJSON(localeFile).error(function(){
        return null;
      });
    },

    _tryConvertLocale: function(locale){
      var matches = rLocale.exec(locale);
      if (!matches){
        return;
      }
      var language = matches[1].toLowerCase();
      var region = matches[3];
      if (region){
        return language + '_' + region.toUpperCase();
      } else {
        return language;
      }
    },

    _convertLocale: function(locale){
      var loc = this._tryConvertLocale(locale);
      if (!loc){
        throw new Error(LOCALE_FORMAT_ERROR + ': ' + locale);
      }
      return loc;
    }

  });

  function returnNavigatorLanguage(deferred){
    var navLang = navigator.language;
    var locale = I18n._tryConvertLocale(navLang);
    if (locale){
      deferred.resolve(locale);
    } else {
      deferred.reject(LOCALE_FORMAT_ERROR + ': ' + navLang);
    }
  }

  return I18n;

});
