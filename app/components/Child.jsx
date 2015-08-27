var React = require('react');
//var ReactMount = require('react/lib/ReactMount');
//var ReactInstanceHandles = require('react/lib/ReactInstanceHandles');
//
//if (typeof window != 'undefined') {
//  window.ReactMount = ReactMount
//  window.ReactInstanceHandles = ReactInstanceHandles;
//}
//
//

// Searches through all the nodes in viewModel to find the correct child
// at the same time building stack of all the roots to this node
function getLowestNode(node, id, parentStack) {

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

var Child = React.createClass({
  propTypes: {
    tabIndex: React.PropTypes.string,
    lolipop: React.PropTypes.lolipop
  },

  render() {
    console.log('this.props', this.props);
    return (
      <div style={{ border: '1px green dashed', margin: '3px', padding: '5px'}}>
        This is Child component with {this.props.tabIndex} tabIndex
        <div>
          <div tabIndex="2">Child.tabIndex=2</div>
        </div>
        <input type="text" tabIndex="0" value= "Child.tabIndex=0"/>
        <div1>
          <div2>
            <div3>
              <div4 tabIndex="1">Child.tabIndex=1</div4>
            </div3>
          </div2>
        </div1>
      </div>
    );
  }
});

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

function createItem(component) {
  var item = {
    domNode: typeof document != 'undefined' ? document.querySelector('[data-reactid="' + component._rootNodeID + '"]'): null,
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


//{
//  _currentElement: Object(intermidiate object which is inside render())
//  _renderedChildren: [],
//  _renderedComponent: Object
//  _tag: '' // if this is the most lowest node available
//  _rootNodeID: ''
// }


'use strict';

if (typeof window != 'undefined') {
  var ReactMount = require('react/lib/ReactMount');
  window.onkeydown = function (evt) {

    if (evt.keyCode != '32') {
      return;
    }

    var rootInstances = ReactMount._instancesByReactRootID;

    var focusViewModel = Object.keys(rootInstances).map((id) => {
      console.time('time for id: ' + id);
      var result =  flattenNode(rootInstances[id]);
      console.timeEnd('time for id: ' + id);
      return result;
    });

    console.log('focusViewModel', focusViewModel);

    // console.log(JSON.stringify(rootChildren, null, 2));
    var targetNode = evt.target;
    var currentReactId = targetNode.getAttribute('data-reactid');

    // can use isValid
    if (currentReactId) {
      // search through the FocusViewModel for the node 
      // and find out what would be the next node
      console.log('Current target is', currentReactId);

      // searching for the node
      var parentStack = [];
      var currentLowestNode = getLowestNode(focusViewModel[0], currentReactId, parentStack);


      // IMPORTANT: targetNode.tabIndex should be the same as currentTabIndex
      var currentTabIndex = currentLowestNode.tabIndex;
      console.log('what is node', currentLowestNode, parentStack, currentTabIndex);

      //XXX: and what if parent is without tabIndex? which next tab index to use for nextSibling and nextLevel?
      //
      // searching for the next item
      var currentParent = parentStack.pop();
      while (currentParent) {
        var nextNode = findNextFocusedNode(currentParent, currentLowestNode);
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

function t(Component) {
  var Transparent = React.createClass({
    displayName: 'Transparent',
    propTypes: {
      tabIndex: React.PropTypes.string
    },
    render: function () {
      return React.createElement(Component, this.children, this.props);
    }

  });

  return Transparent;
}

module.exports = t(Child);
