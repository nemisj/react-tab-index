var React = require('react');
var Application = require('./Application.jsx');
var indexer = require('./lib/react-tab-index.js');

var mountNode = document.getElementById('application');

window.onload = function () {
  React.render(React.createElement(Application), mountNode, () => {
    console.log('App loaded');
  });
}

window.onkeydown = function (evt) {
  if (evt.keyCode != '32') {
    return;
  }

  var targetNode = evt.target;
  indexer.track(targetNode);

};
