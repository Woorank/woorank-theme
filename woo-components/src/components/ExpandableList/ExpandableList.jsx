const React = require('react');
// const classnames = require('classnames');
const { PropTypes } = React;

class ExpandableList extends React.Component {

  constructor () {
    super();
    this.state = {
      expanded: false
    };
  }

  toArray (list) {
    return Array.isArray(list) ? list : [list];
  }

  render () {
    const items = this.toArray(this.props.children);
    const visibleItems = this.state.expanded ? items : items.slice(0, this.props.itemsVisible);

    const setExpanded = newState => () => this.setState({ expanded: newState });

    return (
      <div className='woo-expandable-list-container'>
        <div className='woo-expandable-list'>
          {visibleItems}
        </div>
        {
          this.state.expanded
            ? <button onClick={setExpanded(false)}>{'show-less'}</button>
            : <button onClick={setExpanded(true)}>{'show-more'}</button>
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
