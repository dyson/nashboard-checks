// Checks number of users using uptime

function check(socket) {

  var exec = require('child_process').exec;

  // Check by spawning a new process to stay non-blocking
  exec('uptime', function (error, stdout, stderr) {
    if (stdout !== '') {
      // Extract require information from stdout
      data = stdout.split(/\s+/);
      users_heading = getIndex(data, 'users,');
      users = data[users_heading - 1];
      

      // Emit successful result to socket as JSON object
      socket.emit('result', {
        check: 'users_total',
        success: {
          users: users,
        }
      });
    }
    else if (error !== null) {
      // Emit unsuccessful result to socket as JSON object
      socket.emit('result', {
        check: 'users_total',
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
