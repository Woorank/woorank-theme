const React = require('react');
const { PropTypes } = React;

class Badge extends React.Component {
  render () {
    const customStyles = this.props.style || {};

    return (
      <span style={customStyles} className='woo-badge'>{this.props.children}</span>
    );
  }
}

Badge.propTypes = {
  style: PropTypes.object
};

module.exports = Badge;
