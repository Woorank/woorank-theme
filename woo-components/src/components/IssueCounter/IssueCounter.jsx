const React = require('react');
const { OverlayTrigger, Tooltip } = require('react-bootstrap');
const classnames = require('classnames');

const Icon = require('../Icon');

class IssueCounter extends React.Component {

  LinkMaybe (props) {
    return props.active
      ? props.children
      : <a href={props.link} className='woo-issue-link'>{props.children}</a>;
  }

  HelpIcon (props) {
    if (!props.tooltip) {
      return null;
    }

    const tooltipComponent = (
      <Tooltip style={{ position: 'absolute' }} id='tooltip'>{props.tooltip}</Tooltip>
    );

    return (
      <div className='woo-issue-counter-icon'>
        <OverlayTrigger placement='top' overlay={tooltipComponent} delayShow={500}>
          <div>
            <Icon type='help' size='favicon' />
            <span>{/* This span is needed for the tooltip positioning */}</span>
          </div>
        </OverlayTrigger>
      </div>
    );
  }

  render () {
    const classes = classnames('woo-issue-counter', this.props.active ? 'active' : '');

    return (
      <this.LinkMaybe active={this.props.active} link={this.props.link}>
        <div className={classes}>
          <span className='woo-issue-counter-amount'>{this.props.amount}</span>
          <span className='woo-issue-counter-label'>{this.props.label}</span>
          <this.HelpIcon tooltip={this.props.tooltip} />
        </div>
      </this.LinkMaybe>
    );
  }
}

IssueCounter.propTypes = {
  active: React.PropTypes.bool,
  amount: React.PropTypes.number.isRequired,
  label: React.PropTypes.string.isRequired,
  link: React.PropTypes.string,
  tooltip: React.PropTypes.string
};

module.exports = IssueCounter;
