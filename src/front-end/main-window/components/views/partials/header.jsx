import React from 'react';
import Electron from 'electron';
import { connect } from 'react-redux';

const ipcRenderer = Electron.ipcRenderer;

const displayName = 'Header';
const propTypes = {
  header: React.PropTypes.object.isRequired
};

class Header extends React.Component {

  constructor() {
    super();

    this.openLink = this.openLink.bind(this);
  }

  openLink() {
    ipcRenderer.send('open-browser', this.props.header.options.out.url);
  }


  render() {
    let refresh = '';
    if (this.props.header.options.action !== null) {
      refresh = <a className="refresh" onClick={ this.props.header.options.action }><i className="fa fa-refresh"></i></a>;
    }

    let linkOut = '';
    if (this.props.header.options.out) {
      if (this.props.header.options.out.url !== null) {
        linkOut = <a className="link-out" onClick={ this.openLink }><i className="fa fa-external-link"></i></a>;
      }
    }

    return (
      <section className="table-header" id="table-header">
          { refresh }
          { linkOut }
        <div className="clearfix"></div>
      </section>
    );
  }
}

Header.displayName = displayName;
const mapStateToProps = (state) => {
  return {
    header: state.header
  };
};

const con = connect(mapStateToProps)(Header);
Header.propTypes = propTypes;

export default con;
