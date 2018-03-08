'use strict';

var React = require('react');

var Child = React.createClass({
  propTypes: {
    tabIndex: React.PropTypes.string,
    lolipop: React.PropTypes.lolipop
  },

  render() {
    console.log('this.props', this.props);
    return (
      <div style={{ border: '1px green dashed', margin: '3px', padding: '5px'}}>
        This is Child component with  tabIndex={this.props.tabIndex}
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


function t(Component) {
  var Transparent = React.createClass({
    displayName: 'Transparent',
    propTypes: {
      tabIndex: React.PropTypes.string
    },
    render: function () {
      // console.log('t', this.props, this.children);
      return React.createElement(Component, this.props);
    }

  });

  return Transparent;
}

module.exports = t(Child);
