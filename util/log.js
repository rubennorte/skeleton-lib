
/*!
 * Skeleton.js - Log
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  'underscore',
  'underscore.string'
], function(_, _s){

  'use strict';

  // The "window" object
  var root = typeof(window) !== 'undefined' ? window : this;

  // If console is undefined, define one with all functions as noop (IE hack)
  if (!root.console){
    var noop = function(){};
    root.console = {
      setLevel: noop,
      isLoggable: noop,
      log: noop,
      trace: noop,
      debug: noop,
      info: noop,
      warn: noop,
      error: noop
    };

    return root.console;
  }

  var LOG_PRIORITIES = {
    trace:  0,
    debug:  1,
    info:   2,
    warn:   3,
    error:  4,
    log:    5,  // Force log
    silent: 6   // No log message is printed at this level
  };


  // Reference to the original console object
  var console = root.console;

  // Current log level
  var logLevel = 'trace'; // Print all messages by default

  /**
   * Console redefinition
   */
  root.console = {

    // Original console
    _console: console,

    LOG_LEVELS: ['trace', 'debug', 'info', 'warn', 'error', 'log'],
    LOG_TAGS: ['T', 'D', 'I', 'W', 'E', 'L'],
   
    /**
     * Returns the date that will be printed on the log
     */
    formatDate: function(date){
      return _s.sprintf('%02d/%02d/%02d - %02d:%02d:%02d',
        date.getDate(), date.getMonth()+1,
        parseInt((''+date.getFullYear()).substr(2), 10),
        date.getHours(), date.getMinutes(), date.getSeconds());
    },

    /**
     * Change the current log level
     */
    setLevel: function(level){
      logLevel = level;
    },

    /**
     * Determines if a log message with the specified level would be printed
     */
    isLoggable: function(level){
      return LOG_PRIORITIES[logLevel] <= LOG_PRIORITIES[level];
    },

    /**
     * Logs the message unless the log is silenced
     */
    log: function(){
      return this._doLog("log", arguments);
    },

    trace: function(){
      return this._doLog("trace", arguments);
    },
    
    debug: function(){
      return this._doLog("debug", arguments);
    },
    
    info: function(){
      return this._doLog("info", arguments);
    },
    
    warn: function(){
      return this._doLog("warn", arguments);
    },
    
    error: function(){
      return this._doLog("error", arguments);
    },

    _doLog: function(level, args){
      args = _.toArray(args);

      var priority = LOG_PRIORITIES[level];
      var logPriority = LOG_PRIORITIES[logLevel];

      if (logPriority <= priority){

        if (typeof(args[0]) === 'string'){
          args[0] = _s.sprintf('%s | %s | %s',
          this.formatDate(new Date()),
          this.LOG_TAGS[priority],
          args[0]);
        }

        if (this.interpolateParameters){
          args = _.map(args, function(arg){
            if (_.isObject(arg) || _.isArray(arg)){
              try {
                return JSON.stringify(arg);
              } catch (e){}
            }
            
            return arg;
          });
          args = [args.join(' ')];
        }

        var method = this.LOG_LEVELS[priority];
        return console[method].apply(console, args);
      }
      return false;
    }

  };

  return root.console;

});
