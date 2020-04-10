'use strict';
/**
  SetTimeouts: version: 1.3
  License: MIT
*/
class SetTimeouts {
  /**
    Constructor of SetTimeouts.
      @repeatLastTimeout - If true, then repeat last timeout (`setinterval` mode). If false, then repeat every timeout once (`setTimeout` mode).
      @id - Identificator of old native timeout/interval, witch must be stopped before this SetTimeouts started. Can be null.
      @functionToCall - function for periodical calling.
      @timeouts - array of timeouts, which describes timeout periods of functionToCall calling. If empty, then functionToCall will never be called.
  */
  constructor(repeatLastTimeout, id, functionToCall, timeouts) {
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
    if (!(this.timeouts instanceof Array)) {
      console.error('timeouts is not an Array');
      return;
    }
    this.id = id;

  }

  /**
    Stop the SetTimeouts loop.
  */
  stop() {
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
  start() {
    this.stop();
    if (this.timeouts.length > 0) {
    	let t = this.timeouts.shift();
      	if (typeof t !== 'number') {
          console.error('one of timeout in timeouts is not an Number: '+t);
          return;
        }
      	if (t<1) {
        	t = 1;
        }
      	let f = () => {
          this.functionToCall();
          this.start();
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
  startSoft(doNotWarn) {
    if (!this.id) {
        this.start();
    } else if (this.functionToCall === this.functionToCallOrig) {
        this.timeouts.unshift(0.5);
        let functionToCallOld = this.functionToCall;
        this.functionToCall = () => {
            functionToCallOld();
            if (!this.repeatLastTimeout) {
                this.timeouts.shift();
            }
            this.functionToCall = this.functionToCallOrig;
            this.start();
        };
    } else if (!doNotWarn) {
        console.warn('startSoft already initiated, no need additional');
    }
  }
}
