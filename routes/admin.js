var models  = require('../models');
var express = require('express');
var util = require('util');
var router  = express.Router();
var Sequelize = require('sequelize');
var Promise = require('promise');


router.get('/', function(req, res) {
    res.render('admin');
});

router.post('/create', function(req, res) {
  models.Question.create({
    question: req.body.question
  }).then(function(question) {
    res.json(question);
  });
});

router.post('/:question_id/edit', function (req, res) {

  models
    .Question
    .find({ where: { id: req.params.question_id }, include: [{model: models.Option, as: 'Options' }] })
    .then(function(question) {
      var options = req.body.options;
      var promises = []
      var new_options = [];
      options.forEach(function (option, index) {

          if(option.content.length === 0){
            promises.push(
              models.Option.destroy({
                where: {
                  id: option.id
                }
              }).then(function(thing) {
                return option;
              })
            )
          } else {
            promises.push(
              models
                .Option
                .upsert({ id: option.id, content: option.content, QuestionId: question.id})
                .then(function(result) {
                  new_options.push(option);
                  return option;
                })
            )
          }

      });

      Promise.all(promises).then(function() {
        console.log("new_options: "+util.inspect(new_options));
        question.update({question: req.body.question, Options: new_options }).then(function(updatedQuestion) {
          res.json(updatedQuestion);
        });
      })

    });

});

router.get('/:question_id/destroy', function(req, res) {
  models.Question.destroy({
    where: {
      id: req.params.question_id
    }
  }).then(function() {
    res.redirect('/');
  });
});



router.post('/:question_id/options/create', function (req, res) {
  models.Option.create({
    content: req.body.content,
    QuestionId: req.params.question_id
  }).then(function() {
    res.redirect('/');
  });
});

router.get('/:question_id/options/:option_id/destroy', function (req, res) {
  models.Option.destroy({
    where: {
      id: req.params.option_id
    }
  }).then(function() {
    res.send(true);
  });
});

router.post('/:question_id/answers/create', function (req, res) {
  models.Answer.create({
    content: req.body.content,
    QuestionId: req.params.question_id
  }).then(function(a) {
    res.json({"sup": "bitch"});
  });
});

router.get('/:question_id/answers/:answer_id/destroy', function (req, res) {
  models.Answer.destroy({
    where: {
      id: req.params.answer_id
    }
  }).then(function() {
    res.redirect('/');
  });
});



module.exports = router;
