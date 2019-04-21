'use strict';

var express = require('express');
var app = express();
var port = process.env.PORT || 8000;
app.use(express.static(__dirname));

app.get('/', function (req, res) {
  res.send('index'); // This will serve your request to '/'.
});

app.listen(port, function () {
  console.log('Example app listening on port 8000!');
});
//# sourceMappingURL=server.js.map