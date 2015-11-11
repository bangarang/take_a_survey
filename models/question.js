'use strict';
module.exports = function(sequelize, DataTypes) {
  var Question = sequelize.define('Question', {
    question: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Question.hasMany(models.Answer);
        Question.hasMany(models.Option);
      }
    }
  });
  return Question;
};
