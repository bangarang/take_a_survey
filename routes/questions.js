var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
  models.Question.findAll({
    include: [{ all: true } ]
  }).then(function(questions) {
    var filtered_questions = questions.filter(function(question){
      return question.Options.length > 0;
    });
    res.json(filtered_questions);
  });
});

router.get('/all', function(req, res) {
  models.Question.findAll({
    include: [{ all: true } ]
  }).then(function(questions) {
    res.json(questions);
  });
});

router.get('/:question_id/', function (req, res) {
  models.Question.findAll({
    where: {
      id: req.params.question_id
    }
  }).then(function(question) {
    res.json(question);
  });
});

router.post('/:question_id/answers/create', function (req, res) {
  models.Answer.create({
    content: req.body.content,
    QuestionId: req.params.question_id
  }).then(function(answer) {
      res.json(answer);
  });
});



module.exports = router;
