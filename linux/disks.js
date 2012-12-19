// Checks system mounted disks (in kb)

function check(socket) {

  var exec = require('child_process').exec;

  // Check by spawning a new process to stay non-blocking
  exec('df', function (error, stdout, stderr) {
    if (stdout !== '') {
      // Extract require information from stdout
      rows = stdout.split("\n");
      headings = rows[0].split(/\s+/);
      
      
      disks = [];
      
      for (var i = 1; i < rows.length - 1; i++) {
        data = rows[i].split(/\s+/);
        mount = data[getIndex(headings, 'Mounted')];
        size = data[getIndex(headings, '1K-blocks')];
        used = data[getIndex(headings, 'Used')];
        disks.push({mount: mount, size: size, used: used});
      }

      // Emit successful result to socket as JSON object
      socket.emit('result', {
        check: 'disks',
        success: {
          disks: disks
        }
      });
    }
    else if (error !== null) {
      // Emit unsuccessful result to socket as JSON object
      socket.emit('result', {
        check: 'disks',
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
