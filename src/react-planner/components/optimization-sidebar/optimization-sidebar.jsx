import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import * as _ from 'lodash';
import { injectIntl } from 'react-intl';
import { Card, CardBody, CardTitle, Button, ButtonGroup, CardImg, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import IntlMessages from '../../../helpers/IntlMessages';
import LineChart from './line-chart';
import { CHART_COLOR_LIST } from '../../constants';
import * as optimizationActionsAll from '../../actions/optimization-actions';
import * as menuActionsAll from '../../../redux/menu/actions';

function OptimizationSidebar({
  intl,
  optimizationActions,
  loadedProject,
  showOptimizationBar,
  optimizeData,
  email,
  name,
  userId,
  menuActions,
  isOptimized,
}) {
  const [lineChartData, setLineChartData] = useState({});
  const [selectedoptimizeData, setOptimizeData] = useState([]);
  const [imagePrefix, setImagePrefix] = useState(null);
  const [floorDropDownData, setFloorDropDownData] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedFloorText, setSelectedFloorText] = useState(null);

  useEffect(() => {
    if (optimizeData && optimizeData.paretoPoints) {
      const firstProps = optimizeData.paretoPoints[Object.keys(optimizeData.paretoPoints)[0]];
      const labels = Object.keys(firstProps);
      let i = 0;
      const data = {
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
      };

      // Calculate the floor dropdown data
      const floors = [];
      Object.keys(optimizeData.optimizeResults).map((key) => {
        const value = optimizeData.optimizeResults[key];
        const { losa } = value;
        losa.map(floor => {
          if (!_.isNil(floor['Piso del Panel']) && !_.includes(floors, floor['Piso del Panel'])) {
            floors.push(floor['Piso del Panel']);
          }
        })
      });
      setFloorDropDownData(floors.map(floor => {
        return {
          id: floor,
          text: `${intl.formatMessage({ id: 'planner.floor' })} ${floor}`
        }
      }));
      setLineChartData(data);
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
      if (plan) {
        setOptimizeData(plan);
        menuActions.turnOnOptimizeButton();
        optimizationActions.selectedOptimizePlan(plan.solution);
      }

      setImagePrefix(`${process.env.REACT_APP_API_ENDPOINT}/api/images/${userId}/${loadedProject?.id}/imagen_losa_${paneles}_${costo}_${mesas}_`);
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
    if (isOptimized) {
      const projectName = loadedProject ? loadedProject.name : '';

      menuActions.processOptimizeData(
        projectName,
        email,
        name,
        selectedoptimizeData
      );
    }
  };

  const handleLoadOriginal = () => {
    if (isOptimized) {
      const sceneJS = loadedProject ? loadedProject.state : null;
      menuActions.turnOffOptimizeButton();
      optimizationActions.loadOriginal(sceneJS);
    }
  };

  const handleChangeFloor = (floor) => {
    setSelectedFloor(floor);
    const text = `${intl.formatMessage({ id: 'planner.floor'} )} ${floor}`;
    setSelectedFloorText(text);
  }



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
              <div className="btn-group float-right float-none-xs mt-2">
                <UncontrolledDropdown>
                  <DropdownToggle caret color="primary" className="btn-xs" outline>
                    {selectedFloor ? selectedFloorText : <IntlMessages id="planner.floor" />}
                    
                  </DropdownToggle>
                  <DropdownMenu right>
                    {floorDropDownData.map((el) => (
                      <DropdownItem key={`floor_${el.id}`}
                      onClick={() => handleChangeFloor(el.id)}
                      >
                        {el.text}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
              <div className="dashboard-line-chart">
                <LineChart
                  shadow
                  data={lineChartData}
                  options={lineChartOptions}
                />
              </div>
              {userId && loadedProject && imagePrefix && selectedFloor && (
                <a href={`${imagePrefix}${selectedFloor}.png`} target="_blank" rel="noreferrer">
                  <CardImg className="mt-4" top src={`${imagePrefix}${selectedFloor}.png`} alt="Preview" />
                </a>
              )}
            </CardBody>
          </Card>
          <br />
          <ButtonGroup className="center">
            <Button
              className="mb-2"
              color="primary"
              onClick={() => handleProcessOptimize()}
            >
              <IntlMessages id="planner.generate" />
            </Button>
            <Button
              color="primary"
              className="mb-2"
              onClick={() => handleLoadOriginal()}
              active={isOptimized}
            >
              <IntlMessages
                id={isOptimized ? 'planner.optimized' : 'planner.original'}
              />
            </Button>
          </ButtonGroup>
        </div>
      )}
    </div>
  );
}

const mapStateToProps = ({ menu, planner, authUser, projects }) => {
  const { optimizeData, isOptimized } = menu;
  const { loadedProject } = projects;

  return {
    optimizeData,
    statePlanner: planner,
    email: authUser.email,
    name: authUser.displayName,
    userId: authUser.user,
    loadedProject,
    isOptimized,
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
  injectIntl(connect(mapStateToProps, mapDispatchToProps)(OptimizationSidebar))
);
