module.exports = {
  launch: data => `Welcome to The Times Daily Quiz.`,

  quiz: data => `Quiz`,
  question: data => `Question`,
  answer: data => `Answer`,

  listQuizIntent: data => `Here are today's quizzes.`,
  listQuizPrompt: data => `Which quiz would you like to play?`,

  startQuizPrompt: data => `Let's begin.`,

  answerCorrect: data => `Correct.`,
  answerIncorrect: data => `Incorrect.`,

  nextQuestion: data => `Let's move on to the next question.`,

  databaseSetError: data =>
    `Sorry an error has occurred. It has not been possible to store your progress. Please try starting the quiz again.`,

  databaseGetError: data =>
    `Sorry an error has occurred. It has not been possible to retrieve your progress. Please try starting the quiz again.`,

  invalidQuizError: data =>
    `Sorry I did not understand. Which quiz would you like to play?`,

  help: data =>
    `This will be said when an IntentRequest is made with the AMAZON.HelpIntent intent. It should end with a question to prompt the user.`,

  unknownIntent: data =>
    `This will be said when an IntentRequest is made with an unknown intent.`,
};
