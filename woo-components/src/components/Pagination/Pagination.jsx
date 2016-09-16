const React = require('react');
const { PropTypes } = React;

class Pagination extends React.Component {

  render () {
    const PageLinks = ({amount}) => {
      return (
        <div>
          {
            Array(amount).fill().map((_, i) => {
              return <button className='btn btn-default' key={i}
                onClick={() => this.props.onPagination(i * this.props.step, this.props.step)}>
                {i + 1}
              </button>;
            })
          }
        </div>);
    };

    const pageCount = (
      Math.floor(this.props.total / this.props.step) +
      Math.min(this.props.total % this.props.step, 1)
    );

    return (
      <div className='woo-pagination'>
        <PageLinks amount={pageCount} />
      </div>
    );
  }
}

Pagination.defaultProps = {
  first: 0,
  step: 10
};

Pagination.propTypes = {
  first: PropTypes.number,
  step: PropTypes.number,
  total: PropTypes.number.isRequired,
  onPagination: PropTypes.func
};

module.exports = Pagination;
