const React = require('react');
const { PropTypes } = React;

class Badge extends React.Component {
  render () {
    const customStyles = this.props.style || {};

    return (
      <span style={customStyles} className='woo-badge'>{this.props.value}</span>
    );
  }
}

Badge.propTypes = {
  value: PropTypes.string.isRequired,
  style: PropTypes.object
};

module.exports = Badge;
