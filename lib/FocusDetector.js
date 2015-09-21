
function buildIndexMap(parent) {
  var result = {
    order: [],
    map: {}
  };

  parent.children.forEach(function (child) {
    var index = child.tabIndex;

    if (index == null) {
      // don't include nodes without tabIndex
      return;
    }

    if (!result.map[index]) {
      result.map[index] = [];
      result.order.push(index);
    }

    result.map[index].push(child);
  });

  // sort numbers and strings
  result.order.sort(function (a, b) {
    return a - b;
  });

  return result;
}

// Searches for previous node to focus in the same parent
function findPrevFocusedNode(parent, focusedNode) {
  var currentTabIndex = focusedNode.tabIndex;
  var indexMap = buildIndexMap(parent);
  var childrenByIndex = indexMap.map;

  // node which is going to be focused after the focusedNode
  var nodeToFocus;

  // needed to filter out all the next-siblings
  var foundNode = true;

  // 1. walk through the rest(siblings) of the nodes
  // where tabIndex is the same and take the node which is focusable
  // this means, that it shouldn't be compositeComponent
  // but the real one
  // takeout all the nextSiblings from the map
  childrenByIndex[currentTabIndex] = childrenByIndex[currentTabIndex]
    .filter(function (child) {
      var isSame = (child.rootNodeId == focusedNode.rootNodeId) && (child.nodeName == focusedNode.nodeName);

      // first we return true, before node found
      if (foundNode) {
        // till we find the cutting point
        if (isSame) {
          foundNode = false;
          return false;
        }

        return true;
      }

      // then we return false
      return false;
  });

  nodeToFocus = b({
    order: [ currentTabIndex ],
    map: childrenByIndex
  }, true);

  if (nodeToFocus) {
    return nodeToFocus;
  }

  // 2. Find all children with dicreased tabIndex
  // and replace the order
  var indeces = indexMap.order 
    // filter out all the values above current tabindex
    .filter(function (index) {
      return index < currentTabIndex;
    })

  nodeToFocus = b({
    order: indeces,
    map: childrenByIndex
  }, true);

  if (nodeToFocus) {
    return nodeToFocus;
  }

  // 3. Not found? Go up to the parent and repeat 
  console.log('Will have to search in the parent');
  return null;

}

function a(node, reverse) {
  if (!node.compositeComponent) {
    // it's a composite component and we should take the real value
    return node;
  }

  var indexMap = buildIndexMap(node);

  return b(indexMap, reverse);
}

function b(indexMap, reverse) {

  var nodeToFocus = null;

  var order = indexMap.order;
  var childrenByIndex = indexMap.map;

  // go through all the tabindexes 
  // and find the first correct child
  var orderIndex;

  if (reverse) {
    order = order.reverse();
  }

  order.some(function (tabIndex) {
    var children = childrenByIndex[tabIndex];
    if (children) {
      if (reverse) {
        children = children.reverse();
      }

      return children.some(function (child) {
        nodeToFocus = a(child, reverse);
        return !!nodeToFocus;
      });
    }
  });

  // there are no children in there
  return nodeToFocus;
}

// Searches for next node to focus in the same parent
function findNextFocusedNode(parent, focusedNode) {
  var currentTabIndex = focusedNode.tabIndex;
  var indexMap = buildIndexMap(parent);
  var childrenByIndex = indexMap.map;

  // node which is going to be focused after the focusedNode
  var nodeToFocus;

  // needed to filter out all the prev-siblings
  var foundNode = false;

  // 1. walk through the rest(siblings) of the nodes
  // where tabIndex is the same and take the node which is focusable
  // this means, that it shouldn't be compositeComponent
  // but the real one
  // takeout all the prevSibling from the map
  childrenByIndex[currentTabIndex] = childrenByIndex[currentTabIndex].filter(function (child) {
      var isSame = (child.rootNodeId == focusedNode.rootNodeId) &&
          (child.nodeName == focusedNode.nodeName);
    if (foundNode) { 
      return true;
    } else if (isSame) {
      foundNode = true;
    }

    return false;
  });

  nodeToFocus = b({
    order: [ currentTabIndex ],
    map: childrenByIndex
  });

  if (nodeToFocus) {
    return nodeToFocus;
  }

  // 2. Find all children with increased tabIndex
  // and replace the order
  var indeces = indexMap.order 
    // filter out all the values below current tabindex
    .filter(function (index) {
      return index > currentTabIndex;
    });


  nodeToFocus = b({
    order: indeces,
    map: childrenByIndex
  });

  if (nodeToFocus) {
    return nodeToFocus;
  }

  // 3. Not found? Go up to the parent and repeat 
  console.log('Will have to search in the parent');
  return null;
}

module.exports = {
  findNextFocusedNode: findNextFocusedNode,
  findPrevFocusedNode: findPrevFocusedNode,
  a: a,
  b: b
};
