import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import 'react-progress-bar-plus/lib/progress-bar.css';

const ProgressBarComponent = ({ loading }) => {
  const ProgressBar2 = require('react-progress-bar-plus');

  return (
    <ProgressBar2
      onTop={true}
      percent={loading.percent}
      autoIncrement={loading.autoIncrement}
      intervalTime={500}
      spinner={false}
    />
  );
};

const mapStateToProps = ({ menu }) => {
  const { loading } = menu;
  return { loading };
};
export default withRouter(connect(mapStateToProps, {})(ProgressBarComponent));
