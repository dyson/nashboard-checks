// Checks system load averages over 1m, 5m and 15m using uptime

function check(socket) {

  var exec = require('child_process').exec;

  // Check by spawning a new process to stay non-blocking
  exec('uptime', function (error, stdout, stderr) {
    if (stdout !== '') {
      // Extract require information from stdout
      data = stdout.split(/\s+/);
      average_heading = getIndex(data, 'averages:');
      load_average_1m = data[average_heading + 1];
      load_average_5m = data[average_heading + 2];
      load_average_15m = data[average_heading + 3];

      // Emit successful result to socket as JSON object
      socket.emit('result', {
        check: 'load_average',
        success: {
          load_average_1m: load_average_1m,
          load_average_5m: load_average_5m,
          load_average_15m: load_average_15m
        }
      });
    }
    else if (error !== null) {
      // Emit unsuccessful result to socket as JSON object
      socket.emit('result', {
        check: 'load_average',
        error: {
          error: error,
          killed: error['killed'],
          code: error['code'],
          signal: error['signal']
        }
      });
    }
  });
}

function getIndex(array, value) {
  var position = -1
  for (i = 0; i < array.length; i++) {
    if(array[i] == value) {
      position = i;
      break;
    }
  }
  return position;
}

exports.check = check;
exports.filename = __filename;
