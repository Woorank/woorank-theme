const React = require('react');
const classnames = require('classnames');

const Icon = require('../Icon');

class GlobalMenu extends React.Component {
  render () {
    const links = this.props.links.map((item, index) => {
      const active = item.active ? 'active' : '';
      const classes = classnames('woo-global-menu-link', active);

      return (
        <a className={classes}
          key={index}
          href={item.href || '#'}
          onClick={item.action}>
            <Icon type={item.icon} size='sm' />
            <span className='woo-global-menu-link-label'>
              {item.label}
            </span>
          </a>
      );
    });

    return (
      <nav className='woo-global-menu'>
        {links}
      </nav>
    );
  }
}

GlobalMenu.propTypes = {
  links: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      icon: React.PropTypes.string,
      label: React.PropTypes.string,
      href: React.PropTypes.string,
      active: React.PropTypes.boolean
    }).isRequired)
};

module.exports = GlobalMenu;
