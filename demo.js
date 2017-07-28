const handler = require('./handler');

// Place the Alexa testing JSON here

const json1 = `{
  "session": {
    "sessionId": "SessionId.7b279023-3e60-432a-9f63-cc7c0948a0cc",
    "application": {
      "applicationId": "amzn1.ask.skill.7d52f3c6-6480-4d26-8f4f-cb8dd307c3d9"
    },
    "attributes": {},
    "user": {
      "userId": "amzn1.ask.account.AGFOD4THLBZGFOIHVAAZIOBQNLBANWCGGPIS6XACUFN4BGZBKGMD4MUAZF56TFTKERBTZEQJN7M5FKUNJ4HXCPA7TXVCVYL4PR7E25IQNVJ7ZJBJFTWSS7D6LWYNNKEKB74RHEQ36RVUYGWKRJLQNAB7U3YCK5L3WUJREWDXOEVLMJZP3TNX7WL54COOKF47WCZRFUVJW4KRULI"
    },
    "new": false
  },
  "request": {
    "type": "LaunchRequest",
    "requestId": "EdwRequestId.b9942a21-a6ec-410c-b56b-699385f35cef",
    "locale": "en-GB",
    "timestamp": "2017-07-27T16:57:25Z"
  },
  "version": "1.0"
}`;

const json2 = `{
  "session": {
    "sessionId": "SessionId.7b279023-3e60-432a-9f63-cc7c0948a0cc",
    "application": {
      "applicationId": "amzn1.ask.skill.7d52f3c6-6480-4d26-8f4f-cb8dd307c3d9"
    },
    "attributes": {},
    "user": {
      "userId": "amzn1.ask.account.AGFOD4THLBZGFOIHVAAZIOBQNLBANWCGGPIS6XACUFN4BGZBKGMD4MUAZF56TFTKERBTZEQJN7M5FKUNJ4HXCPA7TXVCVYL4PR7E25IQNVJ7ZJBJFTWSS7D6LWYNNKEKB74RHEQ36RVUYGWKRJLQNAB7U3YCK5L3WUJREWDXOEVLMJZP3TNX7WL54COOKF47WCZRFUVJW4KRULI"
    },
    "new": false
  },
  "request": {
    "type": "IntentRequest",
    "requestId": "EdwRequestId.ede3e213-6ecd-4794-9661-12dc11a3b676",
    "locale": "en-GB",
    "timestamp": "2017-07-27T16:31:07Z",
    "intent": {
      "name": "StartQuizIntent",
      "slots": {
        "QuizNumber": {
          "name": "QuizNumber",
          "value": "10"
        }
      }
    }
  },
  "version": "1.0"
}`;

const json3 = `{
  "session": {
    "sessionId": "SessionId.1c81b696-0c31-4505-830a-f1a8dced50f8",
    "application": {
      "applicationId": "amzn1.ask.skill.7d52f3c6-6480-4d26-8f4f-cb8dd307c3d9"
    },
    "attributes": {},
    "user": {
      "userId": "amzn1.ask.account.AGFOD4THLBZGFOIHVAAZIOBQNLBANWCGGPIS6XACUFN4BGZBKGMD4MUAZF56TFTKERBTZEQJN7M5FKUNJ4HXCPA7TXVCVYL4PR7E25IQNVJ7ZJBJFTWSS7D6LWYNNKEKB74RHEQ36RVUYGWKRJLQNAB7U3YCK5L3WUJREWDXOEVLMJZP3TNX7WL54COOKF47WCZRFUVJW4KRULI"
    },
    "new": false
  },
  "request": {
    "type": "IntentRequest",
    "requestId": "EdwRequestId.6a551eaf-5c45-4abb-a99f-d607a14dcfa2",
    "locale": "en-GB",
    "timestamp": "2017-07-27T20:19:43Z",
    "intent": {
      "name": "AnswerQuestionIntent",
      "slots": {
        "AnswerNumber": {
          "name": "AnswerNumber",
          "value": "1"
        }
      }
    }
  },
  "version": "1.0"
}`;

// This will run the Alexa testing code through the handler and log the output to the console
handler.handler(JSON.parse(json2), {}, (err, res) => {
  if (err) {
    console.log('[ERR]', err);
  } else {
    console.log(res);
  }
});
