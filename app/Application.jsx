/*global document, window*/

/**
 * @module Application.jsx
 * Main view component of the page.
 *
 * Renders the HeaderWrapper on top of the page.
 * Renders some random content.
 */

'use strict';

var React = require('react');
var PropTypes = React.PropTypes;

var Transparent = require('./components/Child.jsx');

function nt(Component) {
  var NonTransparent = React.createClass({
    displayName: 'NonTransparent',
    propTypes: {
      tabIndex: React.PropTypes.string
    },
    render: function () {
      console.log('nt2', this.props);

      return (

        <div5 tabIndex="1">
          <h2 tabIndex="2"></h2>
          <Component lolipop="blabla" tabIndex="1">{this.children}</Component>
        </div5>
      );
    },

  });

  return NonTransparent;
}

var Child2 = nt(Transparent);

var Application = React.createClass({


  contextTypes: {
    executeAction: PropTypes.func
  },

  childContextTypes: {
  },

  propTypes: {
  },

  /**
   * Returns child-context object which will be available to all descendant
   * children.
   * @return {Object} context object
   */
  getChildContext() {
    return {
    };
  },

  getInitialState() {
    return {
    };
  },

  render() {
    return (
      <div style={{ border: '1px dashed black', padding: '10px' }}>
        This is Application component with 0 tabindex
        <div tabIndex="0">Application.tabIndex=0</div>
        <div tabIndex="1">Application.tabIndex=1</div>
        <div><input type="text" tabIndex="2" value="Application.tabIndex=2"/></div>
        <div tabIndex="1">Application.tabIndex=1</div>
        --
        <div>
          <Transparent tabIndex="3">Application.tabIndex=3</Transparent>
        </div>
        -- 
        --
        <div tabIndex="5">
          Application.tabIndex=5
          <Child2 tabIndex="4"></Child2>
          <div tabIndex="3">Application.tabIndex=3</div>
        </div>
      </div>
    );
  }
});

module.exports = Application;
