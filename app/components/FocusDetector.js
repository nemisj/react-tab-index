
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

function findNextFocusedNode(parent, focusedNode) {
  var currentTabIndex = focusedNode.tabIndex;
  var indexMap = buildIndexMap(parent);
  console.log('indexMap is', indexMap);

  // filter out all the values below
  indexMap.order = indexMap.order.filter(function (index) {
    return index >= currentTabIndex;
  });

  // take out the current tabIndexitem
  indexMap.order.shift();

  console.log('indexMap starts from', indexMap);

  // 1. walk through the rest(siblings) of the nodes
  // when tabIndex is the same
  var nextSibling = getNextSibling(indexMap.map[currentTabIndex], focusedNode);

  if (nextSibling) {
    console.log('Found child as nextSibling');
    // this node can be compositeComponent which means
    // we have to fall through into the first child there
    return nextSibling;
  }

  // 2. Find child with increased tabIndex
  // taking the next first item from array
  var nextLevel = indexMap.map[indexMap.order[0]];
  // taking the first element of the nextLevel elements
  var nextFocusedChild = nextLevel ? nextLevel[0] : null;
  if (nextFocusedChild) {
    console.log('Found child in nextLevel');
    // we have to fall through into the first child there
    return nextFocusedChild;
  }

  // 3. Not found? Go up to the parent and repeat 
  console.log('Will have to search in the parent');
  return null;
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
  findNextFocusedNode: findNextFocusedNode

};
