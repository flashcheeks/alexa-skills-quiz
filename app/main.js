'use strict';

// load amazon sdk and set region
const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-1' });

// get database client
const DynamoDB = new AWS.DynamoDB();

// get language strings
const lang = require('./lang/main')('en');

// get quiz config data
const quizConfig = require('../data/quiz-config.json');

/*
 * 
 * Quiz getters
 * 
 */

const getQuizPrefix = quizIndex => {
  return lang.get('quiz') + ' ' + (quizIndex + 1);
};

const getQuizzes = () => {
  return quizConfig.quizzes.map((quiz, index) => {
    return getQuizPrefix(index) + ', ' + quiz.name;
  });
};

const getQuizzesText = () => {
  const intent = lang.get('listQuizIntent');
  const quizzes = getQuizzes().join(' ');
  const prompt = lang.get('listQuizPrompt');
  return intent + ' ' + quizzes + ' ' + prompt;
};

const getQuizIndex = quizId => {
  for (let index in quizConfig.quizzes) {
    if (quizConfig.quizzes[index].id == quizId) {
      return index;
    }
  }
};

/*
 * 
 * Quiz question getters
 * 
 */

const getQuestionPrefix = questionIndex => {
  return lang.get('question') + ' ' + (questionIndex + 1);
};

const getQuestionText = (quizData, questionIndex) => {
  const prefix = getQuestionPrefix(questionIndex);
  const question = quizData.questions[questionIndex].question;
  return prefix + ', ' + question;
};

/*
 * 
 * Quiz answer getters
 * 
 */

/*const getAnswerText = (quizData, questionIndex) => {
  const obj = quizData.questions[questionIndex];
  return obj.hasOwnProperty('anwser') ? obj.anwser : '';
};*/

const getAnswerPrefix = anwserIndex => {
  return lang.get('answer') + ' ' + (anwserIndex + 1);
};

const getAnswers = questions => {
  return questions.anwsers.map((a, i) => {
    return getAnswerPrefix(i) + ', ' + a.answer;
  });
};

const getAnswersText = (quizData, questionIndex) => {
  const obj = quizData.questions[questionIndex];
  return obj.hasOwnProperty('anwsers') ? getAnswers(obj).join(' ') : '';
};

const getAnswerResult = (questions, answerIndex, score) => {
  return questions.hasOwnProperty('anwsers') &&
    answerIndex >= 0 &&
    answerIndex < questions.anwsers.length &&
    questions.anwsers[answerIndex].hasOwnProperty('correct')
    ? { text: lang.get('answerCorrect'), score: parseInt(score) + 1 }
    : { text: lang.get('answerIncorrect'), score: score };
};

const getQuestionRevealText = (quizData, questionIndex) => {
  const obj = quizData.questions[questionIndex];
  return obj.hasOwnProperty('reveal') ? obj.reveal : '';
};

/*
 * 
 * Intents
 * 
 */

/*const listQuizzesIntent = (event, callback) => {
  const text = getQuizzesText();
  callback(null, getBasicResponse(text));
};*/

const startQuizIntent = (quizUrl, callback) => {
  const quizData = require('../data/' + quizUrl);
  const questionIndex = 0;
  const explainer = quizData.explainer;
  const prompt = lang.get('startQuizPrompt');
  const question = getQuestionText(quizData, questionIndex);
  const answers = getAnswersText(quizData, questionIndex);
  const text = [explainer, prompt, question, answers].join(' ');
  callback(null, getBasicResponse(text));
};

const answerQuestionIntent = (quizUrl, questionIndex, correct, callback) => {
  const quizData = require('../data/' + quizUrl);
  const reveal = getQuestionRevealText(quizData, questionIndex - 1);
  const next = lang.get('nextQuestion');
  const question = getQuestionText(quizData, questionIndex);
  const answers = getAnswersText(quizData, questionIndex);
  const text = [correct, reveal, next, question, answers].join(' ');
  callback(null, getBasicResponse(text));
};

const AnswerQuestionLiteral = (event, callback) => {
  /*const quiz = require('../data/' + quizConfig.quizzes[getQuizIndex()].url);
  let questionIndex = getQuestionIndex();
  const answer = getAnswer(quiz, questionIndex);
  const correct = lang.get('answerCorrect') + ' ' + answer;
  answerQuestionResponse(quiz, correct, callback);*/
};

const answerQuestionResponse = (quiz, correct, callback) => {
  /*let questionIndex = getQuestionIndex();
  const reveal = getQuestionReveal(quiz, questionIndex);
  questionIndex = getQuestionIndex() + 1;
  const question = getQuestion(quiz, questionIndex);
  const answers = getAnswers(quiz, questionIndex);
  const next = lang.get('nextQuestion') + ' ' + question + ' ' + answers;

  callback(null, {
    version: '1.0',
    response: {
      outputSpeech: {
        type: 'PlainText',
        text: correct + ' ' + reveal + ' ' + next,
      },
      shouldEndSession: false,
    },
  });*/
};

const help = (event, callback) => {
  /*callback(null, {
    version: '1.0',
    response: {
      outputSpeech: {
        type: 'PlainText',
        text: lang.get('help'),
      },
      shouldEndSession: false,
    },
  });*/
};

const stop = (event, callback) => {
  callback(null, {
    version: '1.0',
    response: { shouldEndSession: true },
  });
};

const unknownIntent = (event, callback) => {
  const text = lang.get('unknownIntent');
  callback(null, getBasicResponse(text));
};

/*
 * 
 * Intent responses
 * 
 */

const getBasicResponse = text => {
  return {
    version: '1.0',
    response: {
      outputSpeech: { type: 'PlainText', text: text },
      shouldEndSession: false,
    },
  };
};

/*
 * 
 * Intent errors
 * 
 */

const errorIntent = (err, messageStr, callback) => {
  console.log(err);
  const text = lang.get(messageStr);
  callback(null, getBasicResponse(text));
};

/*
 * 
 * Database helpers
 * 
 */

const startQuizSetProgress = (event, callback) => {
  try {
    const userId = event.session.user.userId;
    const quizNumber = event.request.intent.slots.QuizNumber.value;
    const quizIndex = quizNumber - 1;

    if (quizIndex < 0 || quizIndex >= quizConfig.quizzes.length)
      throw new Error('Invalid quiz index error');

    const quizUrl = quizConfig.quizzes[quizIndex].url;
    const quizId = quizConfig.quizzes[quizIndex].id;
    const questionIndex = 0;
    const score = 0;

    saveToDB(userId, quizId, questionIndex, score, function(err, data) {
      err
        ? errorIntent(err, 'databaseSetError', callback)
        : startQuizIntent(quizUrl, callback);
    });
  } catch (err) {
    errorIntent(err, 'invalidQuizError', callback);
  }
};

const answerQuestionGetProgress = (event, callback) => {
  const userId = event.session.user.userId;
  const answerNumber = event.request.intent.slots.AnswerNumber.value;

  getFromDB(userId, function(err, data) {
    err
      ? errorIntent(err, 'databaseSetError', callback)
      : answerQuestionGetResult(data, answerNumber, callback);
  });
};

const answerQuestionGetResult = (obj, answerNumber, callback) => {
  try {
    const userId = obj.Item.userId.S;
    const quizId = obj.Item.quizId.N;
    const quizIndex = getQuizIndex(quizId);

    if (quizIndex == null) throw new Error('Invalid quiz id error');

    const quizUrl = quizConfig.quizzes[quizIndex].url;
    const quizData = require('../data/' + quizUrl);
    let questionIndex = obj.Item.question.N;
    const answerIndex = answerNumber - 1;
    const score = obj.Item.score.N;
    const questions = quizData.questions[questionIndex];
    const result = getAnswerResult(questions, answerIndex, score);

    questionIndex++;
    /*(questionIndex = quizData.questions.length)
      ? resultsIntent()
      : answerQuestionSetProgress(obj, answerNumber, callback);*/

    saveToDB(userId, quizId, questionIndex, result.score, function(err, data) {
      err
        ? errorIntent(err, 'databaseSetError', callback)
        : answerQuestionIntent(quizUrl, questionIndex, result.text, callback);
    });
  } catch (err) {
    errorIntent(err, 'invalidQuizError', callback);
  }
};

/*const answerQuestionSetProgress = (
  userId,
  quizId,
  quizUrl,
  qIndex,
  result,
  callback
) => {
  saveToDB(userId, quizId, qIndex, result.score, function(err, data) {
    err
      ? errorIntent(err, 'databaseSetError', callback)
      : answerQuestionIntent(quizUrl, questionIndex, result.text, callback);
  });
};

const resultsIntent = (score, callback) => {};*/

/*
 * 
 * Database getters and setters
 * 
 */

const saveToDB = (userId, quizId, question, score, callback) => {
  const dynamoParams = {
    Item: {
      userId: { S: userId.toString() },
      quizId: { N: quizId.toString() },
      question: { N: question.toString() },
      score: { N: score.toString() },
    },
    TableName: 'timesDailyQuizTable',
  };
  DynamoDB.putItem(dynamoParams, callback);
};

const getFromDB = (userId, callback) => {
  const dynamoParams = {
    Key: { userId: { S: userId } },
    TableName: 'timesDailyQuizTable',
  };
  DynamoDB.getItem(dynamoParams, callback);
};

/*
 * 
 * Handler modules
 * 
 */

module.exports = {
  launch: callback => {
    const text = lang.get('launch') + ' ' + getQuizzesText();
    callback(null, getBasicResponse(text));
  },

  intent: function(event, callback) {
    switch (event.request.intent.name) {
      /*case 'ListQuizzesIntent':
        listQuizzesIntent(event, callback);
        return;*/
      case 'StartQuizIntent':
        startQuizSetProgress(event, callback);
        return;
      case 'AnswerQuestionIntent':
        answerQuestionGetProgress(event, callback);
        return;
      /*case 'AnswerQuestionLiteral':
        AnswerQuestionLiteral(event, callback);
        return;*/
      /*case 'AMAZON.HelpIntent':
        help(event, callback);
        return;
      case 'AMAZON.CancelIntent':
        help(event, callback);
        return;*/
      case 'AMAZON.StopIntent':
        stop(event, callback);
        return;
      default:
        unknownIntent(event, callback);
        return;
    }
  },
};
