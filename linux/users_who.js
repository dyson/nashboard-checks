// Checks current users via who

function check(socket) {

  var exec = require('child_process').exec;

  // Check by spawning a new process to stay non-blocking
  exec("who | awk '!($1 in a){a[$1];print $1}'", function (error, stdout, stderr) {
    if (stdout !== '') {
      // Extract require information from stdout
      users = stdout.split("\n").shift();

      // Emit successful result to socket as JSON object
      socket.emit('result', {
        check: 'users_who',
        success: {
          users: users,
        }
      });
    }
    else if (error !== null) {
      // Emit unsuccessful result to socket as JSON object
      socket.emit('result', {
        check: 'users_who',
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

exports.check = check;
exports.filename = __filename;
