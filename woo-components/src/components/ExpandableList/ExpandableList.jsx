const React = require('react');
const classnames = require('classnames');
const { PropTypes } = React;

class ExpandableList extends React.Component {

  constructor () {
    super();
    this.state = {
      expanded: false
    };
  }

  toArray (any) {
    return Array.isArray(any) ? any : [any];
  }

  render () {
    const items = this.toArray(this.props.children);
    const canBeExpanded = items.length > this.props.itemsVisible;
    const visibleItems = this.state.expanded ? items : items.slice(0, this.props.itemsVisible);

    const ExpandButton = () => {
      const buttonStyles = classnames('btn', 'btn-default');
      const setExpanded = newState => () => this.setState({ expanded: newState });

      return (
        this.state.expanded
          ? <button className={buttonStyles} onClick={setExpanded(false)}>{this.props.labels.showLess}</button>
          : <button className={buttonStyles} onClick={setExpanded(true)}>{this.props.labels.showAll}</button>
      );
    };

    return (
      <div className='woo-expandable-list-container'>
        <div className='woo-expandable-list'>
          {visibleItems}
        </div>
        {
          canBeExpanded ? <ExpandButton /> : null
        }
      </div>
    );
  }
}

ExpandableList.defaultProps = {
  itemsVisible: 5,
  labels: {
    showAll: 'Show all',
    showLess: 'Show less'
  }
};

ExpandableList.propTypes = {
  itemsVisible: PropTypes.number,
  labels: PropTypes.shape({
    showAll: PropTypes.string,
    showLess: PropTypes.string
  })
};

module.exports = ExpandableList;
