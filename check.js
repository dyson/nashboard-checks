var socket = {};

socket['emit'] = function(key, value) {
  console.log(key + ': ' + JSON.stringify(value));
}

check = require(process.argv[2]);

check.check(socket);
