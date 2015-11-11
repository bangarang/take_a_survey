'use strict';
module.exports = function(sequelize, DataTypes) {
  var Option = sequelize.define('Option', {
    content: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Option.belongsTo(models.Question, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });

      }

    }
  });
  return Option;
};
