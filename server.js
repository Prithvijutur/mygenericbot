var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === 'a_bot_is_a_bot') {
    res.send(req.query['hub.challenge']);
    console.log("validation token successful");
  }
  res.send('Error, wrong validation token');
})

app.post('/webhook', function (req, res) { console.log("in messaging webhook post");
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      console.log(text);
    }
  }
  res.sendStatus(200);
});

var token = "EAAV2q4QDamwBABUMgjZBOyGRt8d8x9qZAO27CFEfbnZAOYZADrMe2B2oHIYQvHPVZCBTZB4sJ98LqF58ZBPmFOrTzp65XYsS0ZAeCw26LukdUCD6Q9r4w8M45HKi8FWCOFdlDV0UxRZAx4rFIth1RZBv2HO1ELuD70LZC9qRf3vtotjZBAZDZD";

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

app.listen(process.env.OPENSHIFT_NODEJS_PORT || 80, process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1", function () {
  console.log('Example app listening on port 80!');
});