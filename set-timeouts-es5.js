'use strict';
/**
  SetTimeouts: version: 1.1
  License: MIT
*/

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SetTimeouts = function () {
  /**
    Constructor of SetTimeouts.
      @repeatLastTimeout - If true, then repeat last timeout (`setinterval` mode). If false, then repeat every timeout once (`setTimeout` mode).
      @id - Identificator of old native timeout/interval, witch must be stopped before this SetTimeouts started. Can be null.
      @functionToCall - function for periodical calling.
      @timeouts - array of timeouts, which describes timeout periods of functionToCall calling. If empty, then functionToCall will never be called.
  */
  function SetTimeouts(repeatLastTimeout, id, functionToCall, timeouts) {
    _classCallCheck(this, SetTimeouts);

    this.repeatLastTimeout = repeatLastTimeout;
    this.functionToCall = functionToCall;
    this.id = null;
    if (typeof this.functionToCall !== 'function') {
      return;
    }
    if (!timeouts) {
      this.timeouts = [];
    } else {
      this.timeouts = timeouts;
    }
    if (!(this.timeouts instanceof Array)) {
      return;
    }
    this.id = id;
  }

  /**
    Stop the SetTimeouts loop.
  */


  _createClass(SetTimeouts, [{
    key: 'stop',
    value: function stop() {
      if (this.id) {
        if (this.repeatLastTimeout) {
          clearInterval(this.id);
        } else {
          clearTimeout(this.id);
        }
      }
      this.id = null;
    }

    /**
      Start the SetTimeouts loop with stopping old (if it is needed).
    */

  }, {
    key: 'start',
    value: function start() {
      var _this = this;

      this.stop();
      if (this.timeouts.length > 0) {
        var t = this.timeouts.shift();
        if (typeof t !== 'number') {
          return;
        }
        if (t < 1) {
          t = 1;
        }
        var f = function f() {
          _this.functionToCall();
          _this.start();
        };
        if (this.repeatLastTimeout) {
          if (this.timeouts.length === 0) {
            this.timeouts.push(t);
            this.id = setInterval(this.functionToCall, t);
          } else {
            this.id = setInterval(f, t);
          }
        } else {
          this.id = setTimeout(f, t);
        }
      }
    }
  }]);

  return SetTimeouts;
}();
