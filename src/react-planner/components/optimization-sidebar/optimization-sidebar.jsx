import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import * as _ from 'lodash';
import { injectIntl } from 'react-intl';
import { Card, CardBody, CardTitle, Button, ButtonGroup, CardImg, DropdownToggle, DropdownMenu, DropdownItem, ButtonDropdown } from 'reactstrap';
import IntlMessages from '../../../helpers/IntlMessages';
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

  const [nestingDropdownOpen, setNestingDropdownOpen] = useState(false);
  const [selectedoptimizeData, setOptimizeData] = useState([]);
  const [imagePrefix, setImagePrefix] = useState(null);
  const [floorDropDownData, setFloorDropDownData] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedFloorText, setSelectedFloorText] = useState(null);

  useEffect(() => {
    if (optimizeData && optimizeData.optimizeResults && Object.keys(optimizeData.optimizeResults).length > 0) {
      const firstResult = optimizeData.optimizeResults[Object.keys(optimizeData.optimizeResults)[0]];
      const { losa } = firstResult;

      // Calculate the floor dropdown data
      const floors = [];
      losa.map(floor => {
        if (!_.isNil(floor['Piso del Panel']) && !_.includes(floors, floor['Piso del Panel'])) {
          floors.push(floor['Piso del Panel']);
        }
      })

      setImagePrefix(`${process.env.REACT_APP_API_ENDPOINT}/api/images/${userId}/${loadedProject?.id}/imagen_losa`);

      setOptimizeData(firstResult);

      setFloorDropDownData(floors.map(floor => {
        return {
          id: floor,
          text: `${intl.formatMessage({ id: 'planner.floor' })} ${floor}`
        }
      }));
    }
  }, [optimizeData]);


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
    setSelectedFloor(floor)
    const text = `${intl.formatMessage({ id: 'planner.floor' })} ${floor}`;
    setSelectedFloorText(text);
    menuActions.turnOnOptimizeButton();
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
              <CardTitle className="text-center">
                <IntlMessages id="planner.optimization-result" />
              </CardTitle>
              <CardBody>
                <ButtonGroup className="z px-5 mb-2 col d-flex justify-content-center">
                  <ButtonDropdown
                    isOpen={nestingDropdownOpen}
                    toggle={() => setNestingDropdownOpen(!nestingDropdownOpen)}
                  >
                    <DropdownToggle caret>
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
                  </ButtonDropdown>
                  <Button
                    disabled={!selectedFloor}
                    onClick={() => handleProcessOptimize()}
                  >
                    <IntlMessages id="planner.generate" />
                  </Button>
                </ButtonGroup>
              </CardBody>
              {userId && loadedProject && imagePrefix && selectedFloor && (
                <a href={`${imagePrefix}_${selectedFloor}.png`} target="_blank" rel="noreferrer">
                  <CardImg className="mt-4" top src={`${imagePrefix}_${selectedFloor}.png`} alt="Preview" />
                </a>
              )}
            </CardBody>
          </Card>

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
