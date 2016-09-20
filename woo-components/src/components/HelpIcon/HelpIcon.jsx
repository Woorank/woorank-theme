const React = require('react');
const { PropTypes } = React;
const { OverlayTrigger, Tooltip } = require('react-bootstrap');

const Icon = require('../Icon');

class HelpIcon extends React.Component {
  render () {
    if (!this.props.tooltip) {
      return null;
    }

    const size = this.props.size || 'favicon';

    const tooltipComponent = (
      <Tooltip style={{ position: 'absolute' }} id='tooltip'>{this.props.tooltip}</Tooltip>
    );

    return (
      <div className='woo-help-icon'>
        <OverlayTrigger placement='top' overlay={tooltipComponent} delayShow={500}>
          <div>
            <Icon type='help' size={size} />
            <span>{/* This span is needed for the tooltip positioning */}</span>
          </div>
        </OverlayTrigger>
      </div>
    );
  }
}

HelpIcon.propTypes = {
  tooltip: PropTypes.string,
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
  ])
};

module.exports = HelpIcon;
