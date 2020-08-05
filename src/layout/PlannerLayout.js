import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import TopnavPlanner from '../containers/navs/TopnavPlanner';
// import Sidebar from '../containers/navs/Sidebar';

const PlannerLayout = ({ containerClassnames, children, history }) => {
  return (
    <div id="planner-container" className={containerClassnames}>
      <TopnavPlanner history={history} />
      <main>
        <div className="container-fluid">{children}</div>
      </main>
    </div>
  );
};
const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};
const mapActionToProps = {};

export default withRouter(
  connect(mapStateToProps, mapActionToProps)(PlannerLayout)
);

