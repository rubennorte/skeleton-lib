
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

  var rLocale = /^([a-zA-Z]{2})([-_]([a-zA-Z]{2}))?$/,
      rStrictLocale = /^([a-z]{2})([_]([A-Z]{2}))?$/;

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

    // List of all available locales.
    // If null, the existence of each locale file is not verified before
    // trying to load it
    _availableLocales: null,
    
    /**
     * Translates the specified parameter.
     * If it's an object, we assume that the object keys are the language code
     * and the object values are the translations for that language.
     * Otherwise, search the translation for that key in the stored translations
     */
    t: function(text){

      switch (typeof(text)){
        case 'string':
          // If text is a string, search in translation object
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
          break;

        case 'object':
          // If text is an object, get the translations from it according
          // to the current locale
          if (this._locale in text) text = text[this._locale];
          else text = text[config.i18n.defaultLocale];
          break;

        default:
          throw new Error('String or object parameter expected');
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
     * Returns the default locale according to the information provided by the navigator
     */
    getDefaultLocale: function(){
      var locale;

      if (!navigator) return;

      // Android fix
      if (navigator.userAgent && (locale = navigator.userAgent.match(/android.*\W(\w\w)-(\w\w)\W/i)))
        return locale;

      return navigator.language;
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

      var languageAvailable = _(this.availableLocales).include(locale.substr(0,2));

      if (languageAvailable) return true;

      return locale.length == 5 && _(this.availableLocales).include(locale);
    },

    /**
     * Sets the current locale. The translation object can be passed or
     * it will be loaded from a JSON in the load path. When the locale is set
     * and the translations are loaded, callback function is invoked
     */
    setLocale: function(locale, translations, callback){
      if (!rLocale.test(locale))
        throw new Error('Invalid locale: ' + locale);

      locale = toPOSIXLocale(locale);

      // Check if translations object is defined
      if (typeof(translations) == 'function'){
        callback = translations;
        translations = null;
      }

      // If the locale is the current one, return immediatelly
      if (locale == this.getLocale())
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

        if (!this._availableLocales || _(this._availableLocales).include(language))
          localeFiles.push('json!' + this._getLocaleUrl(language));

        if (region && (!this._availableLocales || _(this._availableLocales).include(locale)))
          localeFiles.push('json!' + this._getLocaleUrl(locale));

        if (localeFiles.length == 0){
          callback && callback('There are no translation files for the locale ' + locale);
          return false;
        }

        var self = this;
        require(localeFiles, function(languageTranslations, regionTranslations){
          var newTranslations = _.extend({}, languageTranslations, regionTranslations);
          self._setLocaleAndTranslations(locale, newTranslations, callback);
        });
      }
    },

    /**
     * Sets the available locale files in the project
     */
    setAvailableLocales: function(availableLocales){
      _(availableLocales).each(function(availableLocale){
        if (!rStrictLocale.test(availableLocale))
          throw new Error('All the locale filenames must have a valid POSIX format (en | en_US)');
      });
      this._availableLocales = availableLocales;
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
      callback && callback(null, locale);
    }

  });

  function toPOSIXLocale(locale){
    if (!locale)
      return locale;

    if (locale.length == 2)
      return locale.toLowerCase();
    
    return locale.substr(0,2).toLowerCase() + '_' + locale.substr(3,2).toUpperCase();
  }

  // Bind all the public functions
  _.bindAll(I18n, 't', 'l', 'getLocale', 'setLocale');

  return I18n;

});
