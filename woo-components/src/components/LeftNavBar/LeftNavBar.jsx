const React = require('react');
const classnames = require('classnames');

const Icon = require('../Icon');

class LeftNavBar extends React.Component {
  render () {
    const links = this.props.links.map((item, index) => {
      const active = item.active ? 'active' : '';
      const classes = classnames('woo-left-nav-link', active);

      return (
        <a className={classes}
          key={index}
          href={item.href || '#'}
          onClick={item.action}>
            <Icon type={item.icon} size='sm' />
            <span className='woo-left-nav-link-label'>
              {item.label}
            </span>
          </a>
      );
    });

    return (
      <nav className='woo-left-nav-bar'>
        {links}
      </nav>
    );
  }
}

LeftNavBar.propTypes = {
  links: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      icon: React.PropTypes.string,
      label: React.PropTypes.string,
      href: React.PropTypes.string,
      active: React.PropTypes.boolean
    }).isRequired)
};

module.exports = LeftNavBar;
