const React = require('react');
const classnames = require('classnames');
const { PropTypes } = React;

let assetPath = 'assets/symbols.svg';

class Icon extends React.Component {

  static setGlobalAssetPath (path) {
    assetPath = path;
  }

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
        dangerouslySetInnerHTML={{ __html: `<use xlink:href="${assetPath}#${type}" />` }} />
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
