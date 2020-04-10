'use strict';
/**
  SetTimeouts: version: 1.3
  License: MIT
*/

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

var SetTimeouts = /*#__PURE__*/function () {
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
    this.functionToCallOrig = functionToCall;
    this.id = null;

    if (typeof this.functionToCall !== 'function') {
      console.error('functionToCall is not a Function');
      return;
    }

    if (!timeouts) {
      this.timeouts = [];
    } else {
      this.timeouts = timeouts;
    }

    if (!_instanceof(this.timeouts, Array)) {
      console.error('timeouts is not an Array');
      return;
    }

    this.id = id;
  }
  /**
    Stop the SetTimeouts loop.
  */


  _createClass(SetTimeouts, [{
    key: "stop",
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
    key: "start",
    value: function start() {
      var _this = this;

      this.stop();

      if (this.timeouts.length > 0) {
        var t = this.timeouts.shift();

        if (typeof t !== 'number') {
          console.error('one of timeout in timeouts is not an Number: ' + t);
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
    /**
      Start the SetTimeouts loop with soft stopping old (ensure that old loop has last one next tick).
    */

  }, {
    key: "startSoft",
    value: function startSoft(doNotWarn) {
      var _this2 = this;

      if (!this.id) {
        this.start();
      } else if (this.functionToCall === this.functionToCallOrig) {
        this.timeouts.unshift(0.5);
        var functionToCallOld = this.functionToCall;

        this.functionToCall = function () {
          functionToCallOld();

          if (!_this2.repeatLastTimeout) {
            _this2.timeouts.shift();
          }

          _this2.functionToCall = _this2.functionToCallOrig;
          _this2.start();
        };
      } else if (!doNotWarn) {
        console.warn('startSoft already initiated, no need additional');
      }
    }
  }]);

  return SetTimeouts;
}();
