//XXX: and what if parent is without tabIndex? which next tab index to use for nextSibling and nextLevel?

var ViewModel = require('./ViewModel.js');
var FocusDetector = require('./FocusDetector.js');

function getLastFocusableNode(node) {
  if (!node.compositeComponent) {
    return node;
  }

  return null;
}


module.exports = {

  findPrev: function (parentStack, currentLowestNode) {
      // searching for the next item
      var currentParent = parentStack.pop();

      while (currentParent) {
        var nextNode = FocusDetector.findPrevFocusedNode(currentParent, currentLowestNode);

        if (nextNode) {
          // nextNode is not composite, it's for sure a child
          console.log('found node to focus', nextNode);
          return nextNode;
        } else {
          // Have to search in a parent
          currentLowestNode = currentParent;
          currentParent = parentStack.pop();
          console.log('will use currentParent as lowest node', currentLowestNode, currentParent);

        }
      }
  },

  findNext: function (parentStack, currentLowestNode) {
      // searching for the next item
      var currentParent = parentStack.pop();

      while (currentParent) {
        var nextNode = FocusDetector.findNextFocusedNode(currentParent, currentLowestNode);
        if (nextNode) {
          // nextNode is not composite, it's for sure a child
          console.log('found node to focus', nextNode);
          return nextNode;
        } else {
          // Have to search in a parent
          currentLowestNode = currentParent;
          currentParent = parentStack.pop();
          console.log('will use currentParent as lowest node', currentLowestNode, currentParent);

        }
      }
  },

  track: function (targetNode, back) {

    var focusViewModel = ViewModel.create();

    // console.log(JSON.stringify(rootChildren, null, 2));
    var currentReactId = targetNode.getAttribute('data-reactid');

    // can use isValid
    if (currentReactId) {
      // search through the FocusViewModel for the node 
      // and find out what would be the next node
      console.log('Current target is', currentReactId);

      // searching for the node
      var parentStack = [];
      var currentLowestNode = ViewModel.getLowestNode(focusViewModel[0], currentReactId, parentStack);


      // IMPORTANT: targetNode.tabIndex should be the same as currentTabIndex
      // var currentTabIndex = currentLowestNode.tabIndex;
      if (!back) {
        return module.exports.findNext(parentStack, currentLowestNode);
      } else {
        return module.exports.findPrev(parentStack, currentLowestNode);
      }


    } else {
      console.log('not a react node');
    }
  }
}
