import React, { Suspense, useEffect } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PlannerPage from './planner-page';
import PlannerLayout from '../../layout/PlannerLayout';


const App = ({ match, loadRemoteProject }) => {
  
  useEffect(() => {
    document.body.style.paddingBottom = 0;
  }, []);

  useEffect(() => {
    const { id } = 
  }, []);

  return (
    <PlannerLayout>
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

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(projectActionsAll, dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
