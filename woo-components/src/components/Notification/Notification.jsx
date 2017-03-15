const React = require('react');
const classnames = require('classnames');
const { PropTypes } = React;

const Icon = require('../Icon');

const DismissButton = ({ onDismiss }) => (
  <button onClick={onDismiss} className='close'>
    <Icon type='cross' />
  </button>
);

DismissButton.propTypes = {
  onDismiss: PropTypes.func.isRequired
};

class Notification extends React.Component {

  constructor () {
    super();

    this.state = {
      dismissed: false
    };

    this.onDismiss = this.onDismiss.bind(this);
  }

  onDismiss () {
    this.setState({ dismissed: true });
    this.props.onDismiss && this.props.onDismiss();
  }

  render () {
    if (this.state.dismissed) {
      return null;
    }

    const alertClasses = classnames(
      'alert',
      this.props.style && `alert-${this.props.style}`
    );

    return (
      <div className={alertClasses}>
        {
          this.props.dismissable
            ? <DismissButton onDismiss={this.onDismiss} />
            : null
        }
        <span>{this.props.children}</span>
      </div>
    );
  }
}

Notification.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
    PropTypes.string
  ]).isRequired,
  style: PropTypes.oneOf([
    'primary',
    'success',
    'warning',
    'danger',
    'error'
  ]),
  dismissable: PropTypes.bool,
  onDismiss: PropTypes.func
};

Notification.defaultProps = {
  dismissable: false
};

module.exports = Notification;
