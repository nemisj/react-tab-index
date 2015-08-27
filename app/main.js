var React = require('react');
var Application = require('./Application.jsx');

var mountNode = document.getElementById('application');

window.onload = function () {
  React.render(React.createElement(Application), mountNode, () => {
    console.log('App loaded');
  });
}
