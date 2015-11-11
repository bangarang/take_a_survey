(function () {
  let React = require('react');
  let ReactDOM = require('react-dom');
  let injectTapEventPlugin = require('react-tap-event-plugin');


  let MainAdmin = require('./main_admin.jsx'); // Our custom react component

  window.React = React;

  //Needed for onTouchTap
  //Can go away when react 1.0 release
  //Check this repo:
  //https://github.com/zilverline/react-tap-event-plugin
  injectTapEventPlugin();

  ReactDOM.render( <MainAdmin />, document.getElementById('example'));
})();
