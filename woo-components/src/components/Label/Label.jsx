const React = require('react');
const { PropTypes } = React;

const classnames = require('classnames');
const omit = require('lodash/omit');

class Label extends React.Component {
  render () {
    const classes = classnames(
      'woo-label',
      this.props.style && `woo-label-${this.props.style}`,
      this.props.noBackground ? 'no-background' : ''
    );
    return <span {...omit(this.props, ['style', 'noBackground'])} className={classes} />;
  }
}

Label.propTypes = {
  style: PropTypes.oneOf([
    'default',
    'primary',
    'success',
    'warning',
    'danger'
  ]),
  noBackground: PropTypes.bool
};

Label.defaultProps = {
  noBackground: false
};

module.exports = Label;
