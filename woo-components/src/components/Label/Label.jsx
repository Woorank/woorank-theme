const React = require('react');
const { PropTypes } = React;

const classnames = require('classnames');
const { omit } = require('lodash');

class Label extends React.Component {
  render () {
    const classes = classnames('woo-label', `woo-label-${this.props.style}`);
    return <span {...omit(this.props, 'style')} className={classes} />;
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

Label.defaultProps = {
  style: 'default'
};

module.exports = Label;
