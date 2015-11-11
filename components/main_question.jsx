/** In this file, we create a React component which incorporates components provided by material-ui */

const React = require('react');
const request = require('superagent');
const util = require('util');

const AppBar = require('material-ui/lib/app-bar');
const IconMenu = require('material-ui/lib/menus/icon-menu');
const IconButton = require('material-ui/lib/icon-button');
const FontIcon = require('material-ui/lib/font-icon');

const Menu = require('material-ui/lib/menus/menu');
const MenuItem = require('material-ui/lib/menus/menu-item');
const MenuDivider = require('material-ui/lib/menus/menu-divider');

const Checkbox = require('material-ui/lib/checkbox');
const RadioButton = require('material-ui/lib/radio-button');
const RadioButtonGroup = require('material-ui/lib/radio-button-group');
const Toggle = require('material-ui/lib/toggle');

const TextField = require('material-ui/lib/text-field');

const Paper = require('material-ui/lib/paper');

const RaisedButton = require('material-ui/lib/raised-button');

const ThemeManager = require('material-ui/lib/styles/theme-manager');
const LightRawTheme = require('material-ui/lib/styles/raw-themes/light-raw-theme');
const Colors = require('material-ui/lib/styles/colors');



const MyRawTheme = require('./my_theme.js');

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}


const MainQuestion = React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getInitialState () {
    return {
      muiTheme: ThemeManager.getMuiTheme(MyRawTheme),
      current_question: {},
      answer: "",
      questions: [],
      answered_questions: [],
      just_answered: false
    };
  },

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
    };
  },

  componentDidMount() {
    this.getQuestions();
  },

  getQuestions() {
    var self = this;
    request
      .get('/questions')
      .end(function(err, res) {
        if (res) {
          var questions = res.body;
          var current_question = shuffleArray(questions).splice(0,1);
          self.setState({questions: questions, current_question: current_question[0]});

        } else {
          console.log('Oh no! error ' + res);
        }
      }.bind(self));
  },

  submitAnswer() {
    var self = this;
    console.log("self.state.answer: "+self.state.answer);
    request
      .post('/questions/'+self.state.current_question.id+'/answers/create')
      .send({
        content: self.state.answer
      })
      .end(function(err, res) {
        if (res.ok) {
          var response = res.body;
          var new_answered_questions = self.state.answered_questions.concat(response);
          self.setState({current_question: {}, answered_questions:new_answered_questions, just_answered: true});

        } else {
          console.log('Oh no! error ' + util.inspect(res));
        }
      }.bind(self));
  },

  nextQuestion(){
    console.log("nextQuestion");
    var self = this;
    var questions = self.state.questions;
    var next_question = questions.splice(0,1);
    self.setState({current_question: next_question[0], questions: questions, just_answered: false})
  },

  answerChange(e){
    var self = this;
    self.setState({answer: e.target.value})
  },

  render() {
    var self = this;

    let containerStyle = {
      maxWidth: '100%',
      width: '500px',
      margin: 'auto',
      display: "flex",
      alignItems: "center",
      justifyContent: "center;"

    };

    var current_question = self.state.current_question;
    var questions = self.state.questions;
    var just_answered = self.state.just_answered;
    if(questions.length || current_question){
      if(!just_answered){
        if(current_question){
          if(current_question.Options){
            var options = current_question.Options.map(function(option){
              return (
                <RadioButton
                  key={option.id}
                  value={option.id.toString()}
                  label={option.content}
                  fullWidth={true}
                  style={{marginBottom:16}} />
                )
            });
          }
        }

        return (
            <div style={containerStyle}>
              <Paper zDepth={3} style={{margin: "25px 0"}}>
                <AppBar
                  title={current_question.question}
                  showMenuIconButton={false} />

                <div className="options">
                  <RadioButtonGroup name="question" fullWidth={true} onChange={self.answerChange} >
                    {options}
                  </RadioButtonGroup>
                </div>

                <RaisedButton label="Submit" primary={true} style={{display: "block"}} onClick={self.submitAnswer}/>
              </Paper>
            </div>
        )
      } else {
        return (
          <div style={containerStyle}>
            <Paper zDepth={3} style={{margin: "25px 0"}}>
              <RaisedButton label="Can you answer the next question?" primary={true} style={{display: "block"}} onClick={self.nextQuestion} />
            </Paper>
          </div>
        )
      }
    } else {
      return (
        <div style={containerStyle}>
          <Paper zDepth={3} style={{margin: "25px 0"}}>
            <div className="options">
              No More Questions
            </div>
          </Paper>
        </div>
      )
    }
  },

});

module.exports = MainQuestion;
