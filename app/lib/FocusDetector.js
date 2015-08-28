
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

  // 1. walk through the rest(siblings) of the nodes
  // where tabIndex is the same
  var prevSibling = getPrevSibling(indexMap.map[currentTabIndex], focusedNode);

  if (prevSibling) {
    console.log('prevSibling is', prevSibling)
    return prevSibling;
  }

  // 2. find node with lower tab-index in the same parent
  var prevIndex = indexMap
    // reverse order of the map
    .order.reverse() 
    // filter out all the values above the current tabindex
    .filter(function (index) {
      return index < currentTabIndex;
    })
    .shift();

  var prevLevel = indexMap.map[prevIndex];

  // taking the first element of the nextLevel elements
  prevSibling = prevLevel[prevLevel.length -1];
  if (prevSibling) {
    console.log('Found child in previous level');
    // we have to fall through into the first child there
    return prevSibling;
  }

  return null;
}

// Searches for next node to focus in the same parent
function findNextFocusedNode(parent, focusedNode) {
  var currentTabIndex = focusedNode.tabIndex;
  var indexMap = buildIndexMap(parent);

  // 1. walk through the rest(siblings) of the nodes
  // where tabIndex is the same
  var nextSibling = getNextSibling(indexMap.map[currentTabIndex], focusedNode);

  if (nextSibling) {
    console.log('Found child as nextSibling');
    // this node can be compositeComponent which means
    // we have to fall through into the first child there
    return nextSibling;
  }

  // 2. Find child with increased tabIndex
  // by taking the next first item from array
  var nextIndex = indexMap.order 
    // filter out all the values below current tabindex
    .filter(function (index) {
      return index > currentTabIndex;
    })
    // taking the first element
    .shift();

  var nextLevel = indexMap.map[nextIndex];

  // taking the first element of the nextLevel elements
  var nextFocusedChild = nextLevel[0];
  if (nextFocusedChild) {
    console.log('Found child in nextLevel');
    // we have to fall through into the first child there
    return nextFocusedChild;
  }

  // 3. Not found? Go up to the parent and repeat 
  console.log('Will have to search in the parent');
  return null;
}

function getPrevSibling(children, child) {
  // reverse them and do getNextSibling
  children = children.reverse();

  return getNextSibling(children, child);
}

function getNextSibling(children, child) {
  for (var i = 0; i < children.length; i++) {
    var aChild = children[i];
    if (aChild == child) {
      return children[i + 1];
    }
  }
  return null;
}

module.exports = {
  findNextFocusedNode: findNextFocusedNode,
  findPrevFocusedNode: findPrevFocusedNode,
  buildIndexMap: buildIndexMap
};
