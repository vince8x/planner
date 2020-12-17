import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, CardBody, CardTitle } from 'reactstrap';
import IntlMessages from '../../../helpers/IntlMessages';
import LineChart from './line-chart';
import { CHART_COLOR_LIST } from '../../constants';
import * as optimizationActionsAll from '../../actions/optimization-actions';

function OptimizationSidebar({
  optimizationActions,
  statePlanner,
  showOptimizationBar,
  optimizeData,
}) {
  const [lineChartData, setLineChartData] = useState({})
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
      const plan =
        optimizeData.optimizeResults[[paneles, costo, mesas].join('_')];
      optimizationActions.selectedOptimizePlan(plan.solution);
    }
  };

  const lineChartOptions = {
    events: ['click'],
    onClick: onClickHandler,
    legend: {
      display: true,
      // onClick: newLegendClickHandler,
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

  return (
    <div id="optimization-bar">
      {showOptimizationBar && optimizeData == null && (
        <div className="loading" />
      )}
      {optimizeData != null && (
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
      )}
    </div>
  );
}

const mapStateToProps = ({ menu, planner }) => {
  const { optimizeData } = menu;
  return {
    optimizeData,
    statePlanner: planner,
  };
};

const mapDispatchToProps = (dispatch) => {
  const result = {
    optimizationActions: bindActionCreators(optimizationActionsAll, dispatch),
  };
  return result;
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OptimizationSidebar)
);
