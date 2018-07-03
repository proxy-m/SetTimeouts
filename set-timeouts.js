/**
  SetTimeouts: version: 1.1
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
}
