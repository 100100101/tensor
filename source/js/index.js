/*GLOBAL*/
global.$ = require('jquery/dist/jquery.min.js');
// global.d3 = require('d3/build/d3.min.js');
// global.riot = require('riot/riot+compiler.min.js');

const
  // _ = require('lodash'),
  docmnt = $(document),
  wndw = $(window)
;
/**/
var
  body = $(document.body)
;

$.fn.extend({
  visualSort: require('./plugins/visualSort.js')
});


/*INITS*/
new body.visualSort({
  /*selector or jQuery object*/
  elementSelector: '.bubbles-queue',
  /**/
  data: {
    length: 15,
    start: 1,
    end: 40
  },
  duration: 800,
  minDiameter: 20
});
/*/INITS/*/
