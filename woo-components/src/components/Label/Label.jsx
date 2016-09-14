const React = require('react');
const classnames = require('classnames');
const { PropTypes } = React;

class Label extends React.Component {
  render () {
    const classes = classnames('woo-label', 'woo-label-' + (this.props.style || 'default'));
    return (
      <span className={classes}>
        {this.props.children}
      </span>
    );
  }
}

Label.propTypes = {
  style: PropTypes.oneOf([
    'default',
    'primary',
    'success',
    'warning',
    'danger'
  ])
};

module.exports = Label;
