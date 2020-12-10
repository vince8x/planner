import React, { Suspense, useEffect } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import 'react-progress-bar-plus/lib/progress-bar.css';
import PlannerPage from './planner-page';
import PlannerLayout from '../../layout/PlannerLayout';
import ProgressBarComponent from '../../layout/ProgressBarComponent';


const App = ({ match }) => {
  
  useEffect(() => {
    document.body.style.paddingBottom = 0;
  }, []);

  const ProgressBar = require('react-progress-bar-plus');

  return (
    <PlannerLayout>
      <ProgressBarComponent />
      <div className="dashboard-wrapper planner-wrapper">
        <Suspense fallback={<div className="loading" />}>
          <Switch>
            <Route
              path={`${match.url}`}
              render={(props) => <PlannerPage {...props} />}
            />
            <Redirect to="/error" />
          </Switch>
        </Suspense>
      </div>
    </PlannerLayout>
  );
};

const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};
export default withRouter(connect(mapStateToProps, {})(App));
