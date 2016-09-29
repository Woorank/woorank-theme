const React = require('react');
const classnames = require('classnames');

const HelpIcon = require('../HelpIcon');

class IssueCounter extends React.Component {

  render () {
    const classes = classnames('woo-issue-counter', this.props.active ? 'active' : '');

    return (
      <div className={classes}>
        <span className='woo-issue-counter-amount'>{this.props.amount}</span>
        <span className='woo-issue-counter-label'>{this.props.label}</span>
        <HelpIcon tooltip={this.props.tooltip} />
      </div>
    );
  }
}

IssueCounter.propTypes = {
  active: React.PropTypes.bool,
  amount: React.PropTypes.number.isRequired,
  label: React.PropTypes.string.isRequired,
  tooltip: React.PropTypes.string
};

module.exports = IssueCounter;
