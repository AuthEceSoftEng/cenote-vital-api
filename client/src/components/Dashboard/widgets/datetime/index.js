import React from 'react';
import PropTypes from 'prop-types';
import tinytime from 'tinytime';

export default class DateTime extends React.Component {
  static propTypes = { interval: PropTypes.number }

  static defaultProps = { interval: 1000 * 10 }

  constructor(props) {
    super(props);
    this.state = { date: new Date() };
    this.timeout = null;
  }

  componentDidMount() {
    const { interval } = this.props;
    this.interval = setInterval(() => this.setState({ date: new Date() }), interval);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { date } = this.state;
    return (
      <div className="widget">
        <div className="time-item">
          {tinytime('{H}:{mm}').render(date)}
        </div>
        <div className="date-item">
          {tinytime('{DD}.{Mo}.{YYYY}').render(date)}
        </div>
      </div>
    );
  }
}
