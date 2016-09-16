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
          ? <button className={buttonStyles} onClick={setExpanded(false)}>{'show-less'}</button>
          : <button className={buttonStyles} onClick={setExpanded(true)}>{'show-more'}</button>
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
  itemsVisible: 5
};

ExpandableList.propTypes = {
  itemsVisible: PropTypes.number
};

module.exports = ExpandableList;
