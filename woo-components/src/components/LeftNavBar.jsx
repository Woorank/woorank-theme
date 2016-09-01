import React, { PropTypes } from 'react';
import classnames from 'classnames';

class LeftNavBar extends React.Component {
  static propTypes = {
    links: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        href: PropTypes.string,
        active: PropTypes.boolean
      }).isRequired)
  };

  render () {
    const links = this.props.links.map((item, index) => {
      const active = item.active ? 'active' : '';
      const classes = classnames('left-nav-link', active);
      return (
        <a className={classes}
          key={index}
          href={item.href || '#'}
          onClick={item.action}>{item.label}</a>
      );
    });

    return (
      <nav className='left-nav'>
        {links}
      </nav>
    );
  }
}

export default LeftNavBar;
