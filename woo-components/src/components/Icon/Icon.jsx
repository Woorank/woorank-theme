const React = require('react');
const classnames = require('classnames');
const { PropTypes } = React;

const config = require('../../../config.js');

class Icon extends React.Component {

  render () {
    const { assetPath, type, size, fill } = this.props;
    const extraClass = this.props.extraClass || false;
    const iconClasses = {
      [`icon-${type}`]: type,
      [`icon-${size}`]: size,
      [`fill-${fill}`]: fill
    };

    return (
      <svg
        className={classnames('woo-icon icon', iconClasses, extraClass)}
        dangerouslySetInnerHTML={{ __html: `<use xlink:href="${assetPath}#${type}" />` }} />
    );
  }
}

Icon.propTypes = {
  assetPath: PropTypes.string,
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

Icon.defaultProps = {
  assetPath: config.iconPath
};

module.exports = Icon;
