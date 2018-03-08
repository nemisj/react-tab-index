var ReactMount = require('react/lib/ReactMount');

function getName(component) {
  var currentElement = component._currentElement;

  if (typeof currentElement == 'string') {
    return currentElement;
  } else if (currentElement) {
    if (typeof currentElement.type == 'function') {
      return currentElement.type.displayName;
    } else {
      return currentElement.type;
    }
  } else {
    console.warn('no current element');
  }
}

function getTabIndex(component) {
  var currentElement = component._currentElement;
  if (currentElement && typeof currentElement != 'string') {
    var props = currentElement._store.props || {};
    //XXX: put tabIndex of the input to 0 if it's not defined
    return 'tabIndex' in props ? props.tabIndex : props.tabindex;
  }
}

//{
//  _currentElement: Object(intermidiate object which is inside render())
//  _renderedChildren: [],
//  _renderedComponent: Object
//  _tag: '' // if this is the most lowest node available
//  _rootNodeID: ''
// }
function createItem(component) {
  var item = {
    domNode: typeof document !== 'undefined' ? document.querySelector('[data-reactid="' + component._rootNodeID + '"]'): null,
      nodeName: getName(component),
    rootNodeId: component._rootNodeID,
    compositeComponent: false,
    tabIndex: getTabIndex(component),
    children: [],
    parent: null
  };

  return item;
}

function flattenNode(component) {
  var item = createItem(component);

  var currentElement = component._currentElement;
  var directChild = component._renderedComponent;

  if (typeof currentElement.type  === 'function') {
    // this is a new type
    // and so, our node
    item.compositeComponent = true;
    // compositeComponent will get tabIndex 0 if not specified
    if (item.tabIndex == null) {

      item.tabIndex = 0;
    }
  }

  var children = component._renderedChildren;
  if (children) {

    Object.keys(children).forEach((id) => {
      var newChild = flattenNode(children[id]);

      // 1. add child to the children array
      item.children.push(newChild);

      if (!newChild.compositeComponent) {
        // 2. if it's not a new type, 
        // transfer all the children into this node
        Array.prototype.push.apply(item.children, newChild.children);
        newChild.children = [];
      }
    });
  } else if (directChild) {

    var newChild = flattenNode(directChild);

    if (typeof currentElement.type == 'string') {
      // don't add this node, since it's intermediate 
    } else {
      // 1. add the child itself
      item.children.push(newChild);
    }

    if (!newChild.compositeComponent) {
      // 2. only now its children
      Array.prototype.push.apply(item.children, newChild.children);
      newChild.children = [];
    }
  }

  return item;
}

module.exports.create = function () {
  var rootInstances = ReactMount._instancesByReactRootID;

  return Object.keys(rootInstances).map((id) => {
    // console.time('time for id: ' + id);
    var result =  flattenNode(rootInstances[id]);
    // console.timeEnd('time for id: ' + id);
    return result;
  });
};

// Searches through all the nodes in viewModel to find the correct child
// at the same time building stack of all the roots to this node
module.exports.getLowestNode =  function getLowestNode(node, id, parentStack) {

  if (node.rootNodeId == id) {
    // check if this is a composite
    if (!node.compositeComponent) {
      return node;
    }
  }

  var theOne = null;
  parentStack.push(node);

  node.children.some(function (childNode) {
    var lowestNode = getLowestNode(childNode, id, parentStack);
    if (lowestNode) {
      theOne = lowestNode;
      return true;
    }
  });

  if (!theOne) {
    // remove parent, only if node not found
    parentStack.pop();
  }

  // going deeper
  return theOne;
}
