var React = require('react');
var Application = require('./Application.jsx');
var indexer = require('./lib/react-tab-index.js');

var mountNode = document.getElementById('application');

window.onload = function () {
  React.render(React.createElement(Application), mountNode, () => {
    console.log('App loaded');
  });
}

var TAB = 9;
var SPACE = 32;

window.onkeydown = function (evt) {
  if (evt.keyCode != TAB) {
    return;
  }

  evt.preventDefault();

  var targetNode = evt.target;
  var node = indexer.track(targetNode, evt.shiftKey);

  console.log('node to focus is', node);

  if (node) {
    setTimeout(function () {
      node.domNode.focus();
    }, 10);
  }

};
