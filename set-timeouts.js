class SetTimeouts {
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
