var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1", process.env.OPENSHIFT_NODEJS_PORT || 8080, function () {
  console.log('Example app listening on port 80!');
});