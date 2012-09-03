// Checks system User, System, and Idle cpu usage using iostat

function check(socket) {

  var exec = require('child_process').exec;

  // Check by spawning a new process to stay non-blocking
  exec('iostat -c 10 2', function (error, stdout, stderr) {
    if (stdout !== '') {
      // Extract require information from stdout
      rows = stdout.split("\n");
      headings = rows[2].split(/\s+/);
      data = rows[6].split(/\s+/);
      cpu_user_heading = getIndex(headings, '%user');
      cpu_user = data[cpu_user_heading];
      cpu_system = data[cpu_user_heading + 2];
      cpu_idle = data[cpu_user_heading + 5];

      // Emit successful result to socket as JSON object
      socket.emit('result', {
        check: 'cpu',
        success: {
          cpu_user: cpu_user,
          cpu_system: cpu_system,
          cpu_idle: cpu_idle
        }
      });
    }
    else if (error !== null) {
      // Emit unsuccessful result to socket as JSON object
      socket.emit('result', {
        check: 'cpu',
        error: error
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
