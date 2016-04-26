import React from 'react';
import Table from './partials/table';
import { connect } from 'react-redux';

const displayName = 'Followed Streams';
const propTypes = {
  store: React.PropTypes.object.isRequired
};

class Followed extends React.Component {
  render() {
    return (
      <div>
        <Table data={ this.props.store.streams.followed }/>
      </div>
    );
  }
}

Followed.displayName = displayName;

const mapStateToProps = (state) => {
  return {
    store: state
  };
};

const con = connect(mapStateToProps)(Followed);

Followed.propTypes = propTypes;

export default con;