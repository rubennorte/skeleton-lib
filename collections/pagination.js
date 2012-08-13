
/*!
 * Skeleton.js - Pagination
 * Copyright(c) 2012 Rubén Norte <rubennorte@gmail.com>
 * MIT Licensed
 */

define([
  'underscore'
], function(_){

  'use strict';

  function getTotalPages(count, perPage){
    // If the collection is empty, there's ONE empty page
    return Math.ceil(count/perPage) || 1;
  }

  var Pagination = {

    paginate: function(name, value){

      var opts = this._paginate;

      // Set default options
      if (!opts){
        opts = this._paginate = {
          page: 1,
          perPage: 10
        };
      }

      // Property getter
      if (typeof(name) === 'string' && typeof(value) === 'undefined'){
        // Computed property
        if (name === 'totalPages'){
          return getTotalPages(this.size(), opts.perPage);
        }
        // Stored property
        return opts[name];
      }

      // Property setter
      if (typeof(name) !== 'undefined'){

        var set = {};
        if (_.isObject(name)){
          // Hash
          set = name;
        } else {
          // Single value
          (set = {})[name] = value;
        }

        _(opts).extend(_(set).pick('page', 'perPage'));
      }

      // If perPage has changed or collection has grown
      // check if page is in the valid range.
      var totalPages = getTotalPages(this.size(), opts.perPage);
      if (opts.page > totalPages)
        opts.page = totalPages;

      // Retrieve paginated models
      var from = (opts.page-1)*opts.perPage,
          to = opts.page*opts.perPage,
          current = this.models.slice(from, to);
      // Store number of elements displayed
      opts.displayed = current.length;

      return current;
    }

  };

  return Pagination;
  
});