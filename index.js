var TAB = 9;
var indexer = module.exports = require('./lib/react-tab-index.js');

module.exports.bindDefault = function () {
  window.onkeydown = function (evt) {
    if (evt.keyCode !== TAB) {
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
};
