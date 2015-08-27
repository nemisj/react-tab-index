var ViewModel = require('./ViewModel.js');
var FocusDetector = require('./FocusDetector.js');

module.exports = {
  track: function (targetNode) {

    var focusViewModel = ViewModel.create();

    console.log('focusViewModel', focusViewModel);

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
      var currentTabIndex = currentLowestNode.tabIndex;
      console.log('what is node', currentLowestNode, parentStack, currentTabIndex);

      //XXX: and what if parent is without tabIndex? which next tab index to use for nextSibling and nextLevel?
      //
      // searching for the next item
      var currentParent = parentStack.pop();
      while (currentParent) {
        var nextNode = FocusDetector.findNextFocusedNode(currentParent, currentLowestNode);
        if (nextNode) {
          console.log('Found next node', nextNode)
          return;
        } else {
          console.log('Have search in a parent');
          currentLowestNode = currentParent;
          currentParent = parentStack.pop();
          console.log('will use currentParent as lowest node', currentLowestNode, currentParent);

        }
      }

    } else {
      console.log('not a react node');
    }
  }
}
