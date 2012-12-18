// Checks system uptime using uptime

function check(socket) {

  var exec = require('child_process').exec;

  // Check by spawning a new process to stay non-blocking
  exec('uptime', function (error, stdout, stderr) {
    if (stdout !== '') {
      // Extract require information from stdout
      data = stdout.split(/\s+/);
      up_heading = getIndex(data, 'up');
      uptime = data[up_heading + 1] + ' ' + data[up_heading + 2].replace(',', '');
      

      // Emit successful result to socket as JSON object
      socket.emit('result', {
        check: 'uptime',
        success: {
          uptime: uptime,
        }
      });
    }
    else if (error !== null) {
      // Emit unsuccessful result to socket as JSON object
      socket.emit('result', {
        check: 'uptime',
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
