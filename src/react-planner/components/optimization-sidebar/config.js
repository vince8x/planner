import { chartTooltip } from './util';

const newLegendClickHandler = function (e, legendItem) {
  const selectedIndex = legendItem.datasetIndex;
  const isSelectedDataSetHidden = this.chart.getDatasetMeta(selectedIndex).hidden !== null && this.chart.getDatasetMeta(selectedIndex).hidden;
  for (let index = 0; index < this.chart.data.datasets.length; index++) {
    const dataSet = this.chart.getDatasetMeta(index);
    if (selectedIndex === index){
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

export const lineChartOptions = {
  legend: {
    display: true,
    onClick: newLegendClickHandler
  },
  responsive: true,
  maintainAspectRatio: false,
  tooltips: chartTooltip,
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
          stepSize: 5,
          min: 50,
          max: 70,
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
export const polarAreaChartOptions = {
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
  scale: {
    ticks: {
      display: false,
    },
  },
  plugins: {
    datalabels: {
      display: false,
    },
  },
  tooltips: chartTooltip,
};
