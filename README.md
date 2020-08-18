# SetTimeouts
Repeated calling of job function with different timeouts (like setTimeout). Last timeout can be interval (like setInterval). First timeout can be immediate (0ms/1ms), so you can emulate setInterval with immediate starting of loop and others.

P.S.: If you want job name identifier, then you can create human-readable name for variable or map key, which you associate with SetTimeouts instance.

# Examples

1) `setInterval` like mode:

```
var f = function() {
  console.warn(new Date().toString());
};
var timeouts = new SetTimeouts(true, null, f, [0, 5000, 7000, 8000]); // assignment creates association of variable `timeouts` with SetTimeouts instance
timeouts.start();
setTimeout( function() {
  timeouts.stop();
  timeouts = new SetTimeouts(true, timeouts.id, f, [10000]);
  timeouts.start();
} , 40000);
setTimeout( function() {
  timeouts.stop();
}, 120000);
```

2) `setTimeout` like mode:

```
var f = function() {
  console.warn(new Date().toString());
};
var timeouts = new SetTimeouts(false, null, f, [0, 2000, 4000, 6000]);
timeouts.start();
```
