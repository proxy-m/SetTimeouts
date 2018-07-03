# SetTimeouts
Call one function with different timeouts (like setTimeout). Last timeout can be interval (like setInterval). First timeout can be immediate (0ms/1ms), so you can emulate setInterval with immediate starting of loop and others.

# Exmaples

1) `setInterval` mode:

```
var f = function() {
  console.warn(new Date().toString());
};
var timeouts = new SetTimeouts(true, null, f, [0, 5000, 7000, 8000]);
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

2) `setTimeout` mode:

```
var f = function() {
  console.warn(new Date().toString());
};
var timeouts = new SetTimeouts(false, null, f, [0, 2000, 4000, 6000]);
timeouts.start();
```
