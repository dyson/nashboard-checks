// Checks system Ram, Buffers/Cache, and Swap usage using free (in kb)

function check(socket) {

  var exec = require('child_process').exec;

  // Check by spawning a new process to stay non-blocking
  exec('free', function (error, stdout, stderr) {
    if (stdout !== '') {
      // Extract require information from stdout
      rows = stdout.split("\n");
      headings = rows[0].split(/\s+/);
      memory_data = rows[1].split(/\s+/);
      buffers_cache_data = rows[2].split(/\s+/);
      swap_data = rows[3].split(/\s+/);
      total_heading = getIndex(headings, 'total');
      
      memory_total = memory_data[total_heading];
      memory_used = memory_data[total_heading + 1];
      memory_free = memory_data[total_heading + 2];
      memory_shared = memory_data[total_heading + 3];
      memory_buffers = memory_data[total_heading + 4];
      memory_cached = memory_data[total_heading + 5];
      
      buffers_cache_used = buffers_cache_data[total_heading + 1];
      buffers_cache_free = buffers_cache_data[total_heading + 2];
      
      swap_total = swap_data[total_heading];
      swap_used = swap_data[total_heading + 1];
      swap_free = swap_data[total_heading + 2];

      // Emit successful result to socket as JSON object
      socket.emit('result', {
        check: 'memory',
        success: {
          memory_total: memory_total,
          memory_used: memory_used,
          memory_free: memory_free,
          memory_shared: memory_shared,
          memory_buffers: memory_buffers,
          memory_cached: memory_cached,
          buffers_cache_used: buffers_cache_used,
          buffers_cache_free: buffers_cache_free,
          swap_total: swap_total,
          swap_used: swap_used,
          swap_free: swap_free
        }
      });
    }
    else if (error !== null) {
      // Emit unsuccessful result to socket as JSON object
      socket.emit('result', {
        check: 'memory',
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
