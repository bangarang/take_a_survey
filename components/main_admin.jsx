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



const Question = React.createClass({
  getInitialState(){
    return {
      answers: [],
      options: [],
      showOptions: false,
      editable: false
    }
  },

  componentWillMount(){
    var self = this;
    self.setState({
      question: self.props.question,
      options: self.props.options || [],
      answers: self.props.answers || [],
      editable: self.props.edit
    });
  },

  saveQuestion(){
    var self = this;
    request
      .post('/admin/'+self.props.id+'/edit')
      .send({
        question: self.state.question,
        options: self.state.options
      })
      .end(function(err, res) {
        if (res.ok) {
          var response = res.body;

          self.setState({question: response.question, options:response.Options, answers:response.Answers, editable: false});

        } else {
          console.log('Oh no! error ' + util.inspect(res));
        }
      }.bind(self));
  },

  toggleEdit(){
    var self = this;
    self.setState({editable: !self.state.editable});
  },

  toggleOptions(){
    var self = this;
    self.setState({showOptions: !self.state.showOptions});
  },

  newOption(){
    var self = this;
    var options = self.state.options;
    var new_options = options.concat({content: ""});
    self.setState({options: new_options});
  },

  optionChange(a,b){
    var self = this;
    var options = self.state.options;
    options[a].content = b;
    self.setState({options: options})
  },

  questionChange(e){
    this.setState({question: e.target.value})
  },

  render() {
    var self = this;

    var question = self.state.question;

    var showOptions = self.state.showOptions;
    var editable = self.state.editable;

    if (editable){
      var options = self.state.options.map(function(option, index){
        function myListener(a,b){
          self.optionChange(a,b.target.value);
        }
        return (
          <TextField floatingLabelText="Option:" defaultValue={option.content} fullWidth={true} onChange={myListener.bind(index,index)}  />
        )
      });
      return (
        <Paper zDepth={3} style={{margin: "25px 0"}}>
          <AppBar title="Edit Question" showMenuIconButton={false} iconElementRight={<IconButton onClick={self.toggleEdit} iconClassName="material-icons">close</IconButton>} />

          <div className="options">
            <TextField floatingLabelText="Question:" defaultValue={question} fullWidth={true} onChange={self.questionChange} />

            {options}

            <RaisedButton label="New Option" primary={true} fullWidth={true} onClick={self.newOption} />

          </div>

          <RaisedButton label="Save" primary={true} fullWidth={true} onClick={self.saveQuestion}/>
        </Paper>

      )
    } else {
      if (showOptions){
        var options = self.state.options.map(function(option){
          if(self.state.answers){
            var answers = self.state.answers.filter(function(answer){
              return parseInt(answer.content) == option.id;
            });
            return (
              <p>{option.content} : {answers.length}</p>
            )
          } else {
            return (
              <p>{option.content} : {0}</p>
            )
          }
        });
        return (
          <Paper zDepth={3} style={{margin: "25px 0"}}>
            <AppBar
              title={question}
              showMenuIconButton={false}
              iconElementRight={<IconButton onClick={self.toggleOptions} iconClassName="material-icons">expand_less</IconButton>} />

            <div className="options">
              {options}
            </div>

            <RaisedButton label="Edit" primary={true} style={{display: "block"}} onClick={self.toggleEdit} />
          </Paper>

        )
      } else {
        return (
          <Paper zDepth={3} style={{margin: "25px 0"}}>
            <AppBar
              title={question}
              showMenuIconButton={false}
              iconElementRight={<IconButton onClick={self.toggleOptions} iconClassName="material-icons">expand_more</IconButton>} />

          </Paper>

        )
      }
    }
  },
});

const MainAdmin = React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getInitialState () {
    return {
      muiTheme: ThemeManager.getMuiTheme(MyRawTheme),
      selected: "",
      question: "",
      questions: [],
      new_question: false
    };
  },

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
    };
  },

  componentWillMount() {
    this.getQuestions();
  },

  getQuestions() {
    var self = this;
    request
      .get('/questions/all')
      .end(function(err, res) {
        if (res) {
          var questions = res.body;
          self.setState({questions: questions});

        } else {
          console.log('Oh no! error ' + res);
        }
      }.bind(self));
  },

  questionChange(e){
    this.setState({question: e.target.value})
  },

  newQuestion(){
    var self = this;
    self.setState({new_question: !self.state.new_question});
  },

  saveQuestion (){
    var self = this;
    request
      .post('/admin/create')
      .send({ question: self.state.question })
      .end(function(err, res) {
        if (res) {
          var new_question = res.body;
          new_question.edit = true;

          self.setState({questions: self.state.questions.concat(new_question).reverse(), question: "", new_question: false})
        } else {
          console.log('Oh no! error ' + res);
        }
      }.bind(self));
  },

  render() {
    var self = this;

    let containerStyle = {
      paddingTop: '5%',
      maxWidth: '100%',
      width: '500px',
      margin: 'auto'
    };


    var questions = self.state.questions.map(function(object){
      var options = object.Options;
      var answers = object.Answers;
      return (
        <Question key={object.id} id={object.id} options={options} answers={answers} question={object.question} edit={object.edit} />
      )
    });

    var new_question = self.state.new_question;

    var question = self.state.question;

    return (
        <div style={containerStyle}>
          { new_question ?
            <Paper zDepth={3} style={{margin: "25px 0"}}>
              <AppBar title="New Question" showMenuIconButton={false} iconElementRight={<IconButton onClick={self.newQuestion} iconClassName="material-icons">close</IconButton>} />

              <div className="options">
                <TextField floatingLabelText="Question:" defaultValue={question} fullWidth={true} onChange={self.questionChange} />
              </div>

              <RaisedButton label="Save" primary={true} fullWidth={true} onClick={self.saveQuestion}/>
            </Paper>
            :
            <Paper zDepth={3}>
              <RaisedButton label="New Question" primary={true} fullWidth={true} onClick={self.newQuestion} />
            </Paper>
          }
          {questions}
        </div>
    );
  },

});

module.exports = MainAdmin;
