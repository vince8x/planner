import { connect } from 'react-redux';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Card, CardBody, CardTitle } from 'reactstrap';
import IntlMessages from '../../../helpers/IntlMessages';
import LineChart from './line-chart';
import { CHART_COLOR_LIST } from '../../constants';

const OptimizationSidebar = ({ showOptimizationBar, optimizeData }) => {

  let lineChartData = {};

  const newLegendClickHandler = function (e, legendItem) {
    const selectedIndex = legendItem.datasetIndex;
    const isSelectedDataSetHidden = this.chart.getDatasetMeta(selectedIndex).hidden !== null && this.chart.getDatasetMeta(selectedIndex).hidden;
    for (let index = 0; index < this.chart.data.datasets.length; index++) {
      const dataSet = this.chart.getDatasetMeta(index);
      if (selectedIndex === index) {
        dataSet.hidden = false
      } else if (isSelectedDataSetHidden) {
        dataSet.hidden = selectedIndex !== index;
      }
      else {
        dataSet.hidden = !dataSet.hidden;
      }
    }
    this.chart.update();
  };

  const onClickHandler = function (e, element) {
    if (element.length > 0) {
      var ind = element[0]._index;
      alert(ind);
    }
  };

  const lineChartOptions = {
    events: ['click'],
    onClick: onClickHandler,
    legend: {
      display: true,
      onClick: newLegendClickHandler
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

  if (optimizeData != null) {
    const firstProps = optimizeData['paretoPoints'][Object.keys(optimizeData['paretoPoints'])[0]];
    const labels = Object.keys(firstProps);
    let i = 0;
    lineChartData = {
      labels: labels,
      datasets: Object.keys(optimizeData['paretoPoints'])
        .map(pareto => {
          let dataTable = Object.values(optimizeData['paretoPoints'][pareto]);
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
          }
        })
    }
  }
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
              <LineChart shadow data={lineChartData} options={lineChartOptions} />
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

const mapStateToProps = ({ menu }) => {
  const { optimizeData } = menu;
  return {
    optimizeData,
  };
};
export default withRouter(connect(mapStateToProps)(OptimizationSidebar));
