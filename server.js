var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === 'a_bot_is_a_bot') {
    res.send(req.query['hub.challenge']);
    console.log("validation token successful");
    res.status(200);
  }
  res.send('Error, wrong validation token');
  res.status(401);
})

function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

app.post('/webhook/', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      console.log(text);
      sendTextMessage(sender, text);
    }
  }
  res.status(200);
});

var token = "EAAV2q4QDamwBANjMWinZC46BjVpu91AaK2C7jpttWrYgsupKRc2nAqSpmRsgLqcDxjiRWEu8pFC9DmujczuLbWExoL7xz9nsFNrBhsjbMgAqCgD3uRbVM3GxMNBpYSp3xMePnkQea7F2E6yQF87hIsR1nHThuP3Fj27fFTgZDZD";



app.listen(process.env.OPENSHIFT_NODEJS_PORT || 80, process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1", function () {
  console.log('Example app listening on port 80!');
});