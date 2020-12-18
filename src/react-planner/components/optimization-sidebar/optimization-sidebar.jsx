import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, CardBody, CardTitle, Button, ButtonGroup } from 'reactstrap';
import IntlMessages from '../../../helpers/IntlMessages';
import LineChart from './line-chart';
import { CHART_COLOR_LIST } from '../../constants';
import * as optimizationActionsAll from '../../actions/optimization-actions';
import * as menuActionsAll from '../../../redux/menu/actions';

function OptimizationSidebar({
  optimizationActions,
  loadedProject,
  showOptimizationBar,
  optimizeData,
  email,
  name,
  menuActions,
}) {
  const [lineChartData, setLineChartData] = useState({});
  const [selectedoptimizeData, setOptimizeData] = useState([]);

  useEffect(() => {
    if (optimizeData != null) {
      const firstProps =
        optimizeData.paretoPoints[Object.keys(optimizeData.paretoPoints)[0]];
      const labels = Object.keys(firstProps);
      let i = 0;
      setLineChartData({
        labels,
        datasets: Object.keys(optimizeData.paretoPoints).map((pareto) => {
          const dataTable = Object.values(optimizeData.paretoPoints[pareto]);
          return {
            label: pareto,
            data: dataTable,
            borderColor: CHART_COLOR_LIST[i],
            pointBackgroundColor: 'white',
            pointBorderColor: CHART_COLOR_LIST[i],
            pointHoverBackgroundColor: CHART_COLOR_LIST[i],
            pointHoverBorderColor: CHART_COLOR_LIST[i++],
            pointRadius: 6,
            pointBorderWidth: 2,
            pointHoverRadius: 8,
            fill: false,
          };
        }),
      });
    }
  }, [optimizeData]);

  const onClickHandler = function (e, elementIndex) {
    if (elementIndex.length > 0) {
      const dataSetKey = Object.keys(optimizeData.paretoPoints)[
        elementIndex[0]._datasetIndex
      ];
      const dataSet = optimizeData.paretoPoints[dataSetKey];
      const mesas = dataSetKey.replace(' mesas', '');
      const paneles = Object.keys(dataSet)[elementIndex[0]._index];
      const costo = dataSet[paneles];
      const plan = optimizeData.optimizeResults[[paneles, costo, mesas].join('_')];
      if (plan) {
        setOptimizeData(plan.solution);
        optimizationActions.selectedOptimizePlan(plan.solution);
      }
    }
  };

  const lineChartOptions = {
    events: ['click'],
    onClick: onClickHandler,
    legend: {
      position: 'bottom',
      labels: {
        padding: 30,
        usePointStyle: true,
        fontSize: 12,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      borderWidth: 0.5,
      bodySpacing: 10,
      xPadding: 15,
      yPadding: 15,
      cornerRadius: 0.15,
    },
    plugins: {
      datalabels: {
        display: false,
      },
    },
    scales: {
      yAxes: [
        {
          gridLines: {
            display: true,
            lineWidth: 1,
            color: 'rgba(0,0,0,0.1)',
            drawBorder: false,
          },
          ticks: {
            beginAtZero: true,
            padding: 20,
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],
    },
  };

  const handleProcessOptimize = () => {
    const projectName = loadedProject ? loadedProject.name : '';

    menuActions.processOptimizeData(
      projectName,
      email,
      name,
      selectedoptimizeData);
  };

  return (
    <div id="optimization-bar">
      {showOptimizationBar && optimizeData == null && (
        <div className="loading" />
      )}
      {optimizeData != null && (
        <div>
          <Card>
            <CardBody>
              <CardTitle>
                <IntlMessages id="planner.optimization-bar" />
              </CardTitle>
              <div className="dashboard-line-chart">
                <LineChart
                  shadow
                  data={lineChartData}
                  options={lineChartOptions}
                />
              </div>
            </CardBody>
          </Card>
          <Button
            className="mb-2"
            color="primary"
            onClick={() => handleProcessOptimize()}
          >
            <IntlMessages id="Original" />
          </Button>
        </div>
      )}
    </div>
  );
}

const mapStateToProps = ({ menu, planner, authUser, projects }) => {
  const { optimizeData } = menu;
  const { loadedProject } = projects;

  return {
    optimizeData,
    statePlanner: planner,
    email: authUser.email,
    name: authUser.displayName,
    loadedProject
  };
};

const mapDispatchToProps = (dispatch) => {
  const result = {
    optimizationActions: bindActionCreators(optimizationActionsAll, dispatch),
    menuActions: bindActionCreators(menuActionsAll, dispatch),
  };
  return result;
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OptimizationSidebar)
);
