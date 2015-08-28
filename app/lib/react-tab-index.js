//XXX: and what if parent is without tabIndex? which next tab index to use for nextSibling and nextLevel?

var ViewModel = require('./ViewModel.js');
var FocusDetector = require('./FocusDetector.js');

function getFirstFocusableNode(node) {

  if (!node.compositeComponent) {
    // it's a composite component and we should take the real value
    return node;
  }

  var parent = node;

  var indexMap = FocusDetector.buildIndexMap(parent);
  // take the first item from the index map
  console.log('map for the current parent is', indexMap);

  var firstTabIndex = indexMap.order[0];

  return  getFirstFocusableNode(indexMap.map[firstTabIndex][0]);
}

module.exports = {

  findPrev: function (parentStack, currentLowestNode) {
      // searching for the next item
      var currentParent = parentStack.pop();

      var prevNode = FocusDetector.findPrevFocusedNode(currentParent, currentLowestNode);

      console.log('new node is', prevNode);

      return prevNode;
  },

  findNext: function (parentStack, currentLowestNode) {
      // searching for the next item
      var currentParent = parentStack.pop();

      while (currentParent) {
        var nextNode = FocusDetector.findNextFocusedNode(currentParent, currentLowestNode);
        if (nextNode) {
          return getFirstFocusableNode(nextNode);
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
