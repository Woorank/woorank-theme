const React = require('react');
const classnames = require('classnames');
const { PropTypes } = React;

class Icon extends React.Component {
  render () {
    const { type, size, fill } = this.props;
    const extraClass = this.props.extraClass || false;
    const iconClasses = {
      [`icon-${type}`]: type,
      [`icon-${size}`]: size,
      [`fill-${fill}`]: fill
    };

    return (
      <svg
        className={classnames('woo-icon icon', iconClasses, extraClass)}
        dangerouslySetInnerHTML={{ __html: `<use xlink:href="assets/symbols.svg#${type}" />` }} />
    );
  }
}

Icon.propTypes = {
  type: PropTypes.string.isRequired,
  size: PropTypes.oneOf([
    'xxs',
    'xs',
    'small',
    'favicon',
    'normal',
    'medium',
    'sm',
    'md',
    'lg',
    'xxl'
  ]),
  fill: PropTypes.string,
  extraClass: PropTypes.string
};

module.exports = Icon;
