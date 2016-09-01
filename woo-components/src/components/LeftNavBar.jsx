const React = require('react');
const classnames = require('classnames');

class LeftNavBar extends React.Component {
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

LeftNavBar.propTypes = {
  links: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      label: React.PropTypes.string,
      href: React.PropTypes.string,
      active: React.PropTypes.boolean
    }).isRequired)
};

export default LeftNavBar;
