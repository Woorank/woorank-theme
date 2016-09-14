const React = require('react');
const classnames = require('classnames');

const HelpIcon = require('../HelpIcon');

class IssueCounter extends React.Component {

  LinkMaybe (props) {
    return props.active
      ? props.children
      : <a href={props.link} className='woo-issue-link'>{props.children}</a>;
  }

  render () {
    const classes = classnames('woo-issue-counter', this.props.active ? 'active' : '');

    return (
      <this.LinkMaybe active={this.props.active} link={this.props.link}>
        <div className={classes}>
          <span className='woo-issue-counter-amount'>{this.props.amount}</span>
          <span className='woo-issue-counter-label'>{this.props.label}</span>
          <HelpIcon tooltip={this.props.tooltip} />
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
