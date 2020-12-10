import { connect } from 'react-redux';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Card, CardBody, CardTitle } from 'reactstrap';
import IntlMessages from '../../../helpers/IntlMessages';
import LineChart from './line-chart';

const lineChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: '',
      data: [54, 63, 60, 65, 60, 68, 60],
      borderColor: '#145388',
      pointBackgroundColor: 'white',
      pointBorderColor: '#145388',
      pointHoverBackgroundColor: '#145388',
      pointHoverBorderColor: 'white',
      pointRadius: 6,
      pointBorderWidth: 2,
      pointHoverRadius: 8,
      fill: false,
    },
    {
      label: '',
      data: [50, 56, 60, 51, 55, 57, 69],
      borderColor: '#ed7117',
      pointBackgroundColor: 'white',
      pointBorderColor: '#ed7117',
      pointHoverBackgroundColor: '#ed7117',
      pointHoverBorderColor: 'white',
      pointRadius: 6,
      pointBorderWidth: 2,
      pointHoverRadius: 8,
      fill: false,
    },
    {
      label: '',
      data: [52, 53, 54, 50, 50, 61, 62],
      borderColor: '#6fb327',
      pointBackgroundColor: 'white',
      pointBorderColor: '#6fb327',
      pointHoverBackgroundColor: '#6fb327',
      pointHoverBorderColor: 'white',
      pointRadius: 6,
      pointBorderWidth: 2,
      pointHoverRadius: 8,
      fill: false,
    },
  ],
};

const OptimizationSidebar = ({ showOptimizationBar, status }) => {
  return (
    <div id="optimization-bar">
      {showOptimizationBar && status == null && <div className="loading" />}
      {status != null && (
        <Card>
          <CardBody>
            <CardTitle>
              <IntlMessages id="planner.optimization-bar" />
            </CardTitle>
            <div className="dashboard-line-chart">
              <LineChart shadow data={lineChartData} />
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

const mapStateToProps = ({ menu }) => {
  const { status } = menu;
  return {
    status,
  };
};
export default withRouter(
  connect(mapStateToProps)(OptimizationSidebar)
);
