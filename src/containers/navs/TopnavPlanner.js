import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import * as _ from 'lodash';
import classNames from 'classnames/bind';
import areapolygon from 'area-polygon';

import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  UncontrolledTooltip,
  Button,
  Badge,
} from 'reactstrap';

import { MdUndo, MdSettings } from 'react-icons/md';
import { GiSteelDoor, GiWindow, GiGate, GiBrickWall } from 'react-icons/gi';
import {
  FaFolderOpen,
  FaFile,
  FaSave,
  FaFileExport,
  FaHome,
  FaPlay,
  FaFileDownload,
  FaFileImport,
} from 'react-icons/fa';
import { AiOutlineBook } from 'react-icons/ai';
import { withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as localeActionsAll from '../../redux/settings/actions';
import * as plannerActionsAll from '../../redux/planner/actions';
import * as menuActionsAll from '../../redux/menu/actions';
import * as optimizationActionsAll from '../../react-planner/actions/optimization-actions';

import * as plannerConstants from '../../react-planner/constants';
import PerimeterWall from '../../catalog/lines/wall/planner-element';
import InteriorWall from '../../catalog/lines/interior-wall/planner-element';
import DividingWall from '../../catalog/lines/dividing-wall/planner-element';
import Separator from '../../catalog/lines/separator/planner-element';
import Door from '../../catalog/holes/door/planner-element';
import Window from '../../catalog/holes/window/planner-element';
import Gate from '../../catalog/holes/gate/planner-element';

import { localeOptions } from '../../constants/defaultValues';

import TopnavEasyAccess from './Topnav.EasyAccess';
import TopnavNotifications from './Topnav.Notifications';

import { getDirection, setDirection } from '../../helpers/Utils';
import { objectsMap } from '../../react-planner/utils/objects-utils';
import actions from '../../react-planner/actions/export';
import IntlMessages from '../../helpers/IntlMessages';
import {
  browserDownload,
  browserUpload,
} from '../../react-planner/utils/browser';
import {
  exportElementsCsv,
  exportAreaCsv,
  exportRequirement,
  convertSceneToElements,
} from '../../react-planner/utils/csv-export';

import {
  THERMAL_REQUIREMENTS,
  FIRE_RESISTANCE_REQUIREMENTS,
  ACOUSTIC_REQUIREMENTS,
} from '../../react-planner/constants';
import { logoutUser, openDialog } from '../../redux/actions';
import { Project } from '../../react-planner/class/export';
import TopNavProfileSection from './TopNavProfileSection';
import { saveRemoteProject } from '../../redux/projects/actions';
import saveSVGScreenshotToFile from '../../helpers/Screenshot';
import { getPlannerState } from '../../redux/planner/selectors';
import calculateArea from '../../react-planner/utils/calculation';
import exportImage from '../../react-planner/utils/image-export';

const TopNavPlanner = ({
  intl,
  locale,
  localeActions,
  projectActions,
  plannerActions,
  menuActions,
  showSaveProjectAsDialog,
  showExportSolutionsDialog,
  linesActions,
  holesActions,
  itemsActions,
  statePlanner,
  loadedProject,
  userId,
  email,
  name,
  mode,
  selectedElement,
  saveRemoteProjectAction,
  optimizing,
  optimizeData,
  optimizationActions
}) => {
  const history = useHistory();

  const [isInFullScreen, setIsInFullScreen] = useState(false);

  const handleChangeLocale = (_locale, direction) => {
    localeActions.changeLocale(_locale);

    const currentDirection = getDirection().direction;
    if (direction !== currentDirection) {
      setDirection(direction);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const isInFullScreenFn = () => {
    return (
      (document.fullscreenElement && document.fullscreenElement !== null) ||
      (document.webkitFullscreenElement &&
        document.webkitFullscreenElement !== null) ||
      (document.mozFullScreenElement &&
        document.mozFullScreenElement !== null) ||
      (document.msFullscreenElement && document.msFullscreenElement !== null)
    );
  };

  const toggleFullScreen = () => {
    const isFS = isInFullScreenFn();

    const docElm = document.documentElement;
    if (!isFS) {
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
      } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
      } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    setIsInFullScreen(!isFS);
  };

  const handleSaveProject = () => {
    if (loadedProject && loadedProject.id) {
      const planner = statePlanner.get('react-planner');
      const { updatedState } = Project.unselectAll(planner);
      const projectState = updatedState.get('scene').toJS();

      const project = {
        ...loadedProject,
        state: projectState,
      };

      // the project is already loaded
      const { id } = project;
      const saveRemoteProjectCallback = (imageBlob) => {
        saveRemoteProjectAction(id, project, imageBlob);
      };

      saveSVGScreenshotToFile(saveRemoteProjectCallback);
    } else {
      // there's no project, we'll add the project by showing the dialog
      showSaveProjectAsDialog();
    }
  };

  const handleLoadProjectFromFile = () => {
    browserUpload().then((data) => {
      projectActions.loadProject(JSON.parse(data));
    });
  };

  const handleOptimize = (isTest) => {
    const state = statePlanner.get('react-planner');
    const { updatedState } = Project.unselectAll(state);
    const { numberOfFloor, firstFloorType, layers } = updatedState.get('scene');
    const scene = updatedState.get('scene').toJS();
    const elements = convertSceneToElements(scene);
    const projectName = loadedProject ? loadedProject.name : '';

    let totalAreaSize = 0;

    layers.map((layer) => {
      layer.areas.map((area) => {
        totalAreaSize = calculateArea(area, layer);
      });
    });

    const numberOfSquareMeters = (numberOfFloor * (totalAreaSize || 0)) / 10000;

    const projectParams = {
      projectName,
      soilType: scene.soilType,
      seismicZone: scene.seismicZone,
      buildingType: scene.buildingType,
      area: numberOfSquareMeters,
      numberOfFloor,
      isVentilatedFloor: firstFloorType === plannerConstants.VENTILATED ? 1 : 0,
    };

    menuActions.turnOffOptimizeButton();
    const sceneJS = loadedProject ? loadedProject.state : null;
    optimizationActions.loadOriginal(sceneJS);
    plannerActions.optimizePlanner(
      userId,
      loadedProject.id,
      elements,
      email,
      name,
      projectParams,
      isTest
    );
  };

  const handleSaveProjectElementsToJsonFile = () => {
    const state = statePlanner.get('react-planner');
    const { updatedState } = Project.unselectAll(state);
    const downloadObject = {
      planner: updatedState.get('scene').toJS(),
      optimizeData
    }
    browserDownload(downloadObject);
  };

  const handleImportProjectFromJson = () => {
    browserUpload().then((data) => {
      const parseResult = JSON.parse(data);
      const planner = parseResult.planner ?? parseResult;
      projectActions.loadProject(planner, parseResult.optimizeData);
    });
  };

  const handleSaveProjectElementsToFile = () => {
    const state = statePlanner.get('react-planner');
    const { updatedState } = Project.unselectAll(state);
    exportElementsCsv(updatedState.get('scene').toJS());
  };

  const handleSaveDrawingToImage = () => {
    const planner = statePlanner.get('react-planner');
    const { updatedState } = Project.unselectAll(planner);
    const projectState = updatedState.get('scene').toJS();

    const project = {
      ...loadedProject,
      state: projectState,
    };

    // the project is already loaded
    const projectName = project?.name;
    const saveRemoteProjectCallback = (imageBlob) => {
      exportImage(imageBlob, projectName);
    };

    saveSVGScreenshotToFile(saveRemoteProjectCallback);
  };

  const handleSaveAreaToFile = () => {
    const state = statePlanner.get('react-planner');
    const { updatedState } = Project.unselectAll(state);
    const { layers } = updatedState.get('scene');
    const allAreas = [];
    let totalAreaSize = 0;
    layers.map((layer) => {
      layer.areas.map((area) => {
        totalAreaSize = calculateArea(area, layer);
        allAreas.push({
          area,
          size: totalAreaSize,
        });
      });
    });

    exportAreaCsv(allAreas);
  };

  const handleSaveProjectRequirementsToFile = (type) => {
    const state = statePlanner.get('react-planner');
    const { updatedState } = Project.unselectAll(state);

    let translateType = 'planner.thermal-requirement';
    if (type === THERMAL_REQUIREMENTS) {
      translateType = intl.formatMessage({ id: 'planner.thermal-requirement' });
    } else if (type === FIRE_RESISTANCE_REQUIREMENTS) {
      translateType = intl.formatMessage({
        id: 'planner.fire-resistance-requirement',
      });
    } else if (type === ACOUSTIC_REQUIREMENTS) {
      translateType = intl.formatMessage({
        id: 'planner.acoustic-requirement',
      });
    }
    exportRequirement(updatedState.get('scene'), type, translateType);
  };

  const handleSelectToolDrawing = (element) => {
    projectActions.unselectAll();
    switch (element.prototype) {
      case 'lines':
        linesActions.selectToolDrawingLine(element.name);
        break;
      case 'items':
        itemsActions.selectToolDrawingItem(element.name);
        break;
      case 'holes':
        holesActions.selectToolDrawingHole(element.name);
        break;
      default:
        break;
    }
    projectActions.pushLastSelectedCatalogElementToHistory(element);
  };

  return (
    <nav className="navbar fixed-top">
      <div
        size="lg"
        className="d-flex align-items-center navbar-left top-toolbar"
      >
        <div className="button-group">
          <Button
            id="planner-home"
            className="toolbar-item"
            onClick={() => history.push('/')}
            disabled={optimizing}
          >
            <FaHome />
            <div className="btn-title">
              <IntlMessages id="menu.home" />
            </div>
            <UncontrolledTooltip placement="right" target="planner-home">
              <IntlMessages id="menu.home" />
            </UncontrolledTooltip>
          </Button>

          <Button
            id="planner-projects"
            className="toolbar-item"
            onClick={() => history.push('/projects')}
            disabled={optimizing}
          >
            <AiOutlineBook />
            <div className="btn-title">
              <IntlMessages id="menu.projects" />
            </div>
            <UncontrolledTooltip placement="right" target="planner-projects">
              <IntlMessages id="menu.projects" />
            </UncontrolledTooltip>
          </Button>
        </div>

        <div className="button-group">
          <Button
            id="planner-new-project"
            className="toolbar-item"
            onClick={() => projectActions.newProject()}
            disabled={optimizing}
          >
            <FaFile />
            <div className="btn-title">
              <IntlMessages id="planner.new" />
            </div>
            <UncontrolledTooltip placement="right" target="planner-new-project">
              <IntlMessages id="planner.new-project" />
            </UncontrolledTooltip>
          </Button>

          <Button
            className="toolbar-item"
            id="planner-save-project"
            onClick={() => handleSaveProject()}
            disabled={optimizing}
          >
            <FaSave />
            <div className="btn-title">
              <IntlMessages id="planner.save" />
            </div>
            <UncontrolledTooltip
              placement="right"
              target="planner-save-project"
            >
              <IntlMessages id="planner.save-project" />
            </UncontrolledTooltip>
          </Button>

          <Button
            className="toolbar-item"
            id="planner-load-project"
            onClick={() => handleLoadProjectFromFile()}
            disabled={optimizing}
          >
            <FaFolderOpen />
            <div className="btn-title">
              <IntlMessages id="planner.load" />
            </div>
            <UncontrolledTooltip
              placement="right"
              target="planner-load-project"
            >
              <IntlMessages id="planner.load-project" />
            </UncontrolledTooltip>
          </Button>

          {loadedProject && (
            <Button
              className="toolbar-item"
              id="planner-optimize-project"
              onClick={() => handleOptimize(false)}
              disabled={optimizing}
            >
              <FaPlay />
              <div className="btn-title">
                <IntlMessages id="planner.optimize" />
              </div>
              <UncontrolledTooltip
                placement="right"
                target="planner-optimize-project"
              >
                <IntlMessages id="planner.optimize" />
              </UncontrolledTooltip>
            </Button>
          )}

          {loadedProject && (
            <Button
              className="toolbar-item"
              id="planner-test-optimize-project"
              onClick={() => handleOptimize(true)}
              disabled={optimizing}
            >
              <FaPlay />
              <div className="btn-title">
                <IntlMessages id="planner.test-optimize" />
              </div>
              <UncontrolledTooltip
                placement="right"
                target="planner-test-optimize-project"
              >
                <IntlMessages id="planner.test-optimize" />
              </UncontrolledTooltip>
            </Button>
          )}

          <Button
            className="toolbar-item"
            id="planner-export-json"
            onClick={() => handleSaveProjectElementsToJsonFile()}
            disabled={optimizing}
          >
            <FaFolderOpen />
            <div className="btn-title">
              <IntlMessages id="planner.export-json" />
            </div>
            <UncontrolledTooltip placement="right" target="planner-export-json">
              <IntlMessages id="planner.export-json" />
            </UncontrolledTooltip>
          </Button>

          <Button
            className="toolbar-item"
            id="planner-import-json"
            onClick={() => handleImportProjectFromJson()}
            disabled={optimizing}
          >
            <FaFileImport />
            <div className="btn-title">
              <IntlMessages id="planner.import-json" />
            </div>
            <UncontrolledTooltip placement="right" target="planner-import-json">
              <IntlMessages id="planner.import-json" />
            </UncontrolledTooltip>
          </Button>

          <Button
            className="toolbar-item"
            id="planner-export-project"
            onClick={() => handleSaveProjectElementsToFile()}
            disabled={optimizing}
          >
            <FaFolderOpen />
            <div className="btn-title">
              <IntlMessages id="planner.export-csv" />
            </div>
            <UncontrolledTooltip
              placement="right"
              target="planner-export-project"
            >
              <IntlMessages id="planner.export-csv" />
            </UncontrolledTooltip>
          </Button>

          <Button
            className="toolbar-item"
            id="planner-export-area"
            onClick={() => handleSaveAreaToFile()}
            disabled={optimizing}
          >
            <FaFolderOpen />
            <div className="btn-title">
              <IntlMessages id="planner.export-area" />
            </div>
            <UncontrolledTooltip placement="right" target="planner-export-area">
              <IntlMessages id="planner.export-area" />
            </UncontrolledTooltip>
          </Button>

          <Button
            className="toolbar-item"
            id="planner-thermal-requirement"
            onClick={() =>
              handleSaveProjectRequirementsToFile(THERMAL_REQUIREMENTS)
            }
            disabled={optimizing}
          >
            <FaFileExport />
            <div className="btn-title">
              <IntlMessages id="planner.thermal" />
            </div>
            <UncontrolledTooltip
              placement="right"
              target="planner-thermal-requirement"
            >
              <IntlMessages id="planner.thermal-requirement" />
            </UncontrolledTooltip>
          </Button>

          <Button
            className="toolbar-item"
            id="planner-fire-resistance-requirement"
            onClick={() =>
              handleSaveProjectRequirementsToFile(FIRE_RESISTANCE_REQUIREMENTS)
            }
            disabled={optimizing}
          >
            <FaFileExport />
            <div className="btn-title">
              <IntlMessages id="planner.fire-resistance" />
            </div>
            <UncontrolledTooltip
              placement="right"
              target="planner-fire-resistance-requirement"
            >
              <IntlMessages id="planner.fire-resistance-requirement" />
            </UncontrolledTooltip>
          </Button>

          <Button
            className="toolbar-item"
            id="planner-acoustic-requirement"
            onClick={() =>
              handleSaveProjectRequirementsToFile(ACOUSTIC_REQUIREMENTS)
            }
            disabled={optimizing}
          >
            <FaFileExport />
            <div className="btn-title">
              <IntlMessages id="planner.acoustic" />
            </div>
            <UncontrolledTooltip
              placement="right"
              target="planner-acoustic-requirement"
            >
              <IntlMessages id="planner.acoustic-requirement" />
            </UncontrolledTooltip>
          </Button>

          <Button
            className="toolbar-item"
            id="planner-export-solutions"
            onClick={() => showExportSolutionsDialog()}
            disabled={optimizing}
          >
            <FaFileDownload />
            <div className="btn-title">
              <IntlMessages id="planner.export-solutions" />
            </div>
            <UncontrolledTooltip
              placement="right"
              target="planner-export-solutions"
            >
              <IntlMessages id="planner.export-solutions" />
            </UncontrolledTooltip>
          </Button>

          <Button
            className="toolbar-item"
            id="planner-export-image"
            onClick={() => handleSaveDrawingToImage()}
            disabled={optimizing}
          >
            <FaFileDownload />
            <div className="btn-title">
              <IntlMessages id="planner.export-image" />
            </div>
            <UncontrolledTooltip
              placement="right"
              target="planner-export-image"
            >
              <IntlMessages id="planner.export-image" />
            </UncontrolledTooltip>
          </Button>
        </div>

        <div className="button-group">
          <Button
            className={classNames({
              'toolbar-item': true,
              active:
                mode === plannerConstants.MODE_DRAWING_HOLE &&
                selectedElement &&
                selectedElement.name === Door.name,
            })}
            id="planner-door"
            onClick={() => handleSelectToolDrawing(Door)}
            disabled={optimizing}
          >
            <GiSteelDoor />
            <div className="btn-title">
              <IntlMessages id="planner.door" />
            </div>
            <UncontrolledTooltip placement="right" target="planner-door">
              <IntlMessages id="planner.door" />
            </UncontrolledTooltip>
          </Button>

          <Button
            className={classNames({
              'toolbar-item': true,
              active:
                mode === plannerConstants.MODE_DRAWING_HOLE &&
                selectedElement &&
                selectedElement.name === Window.name,
            })}
            id="planner-window"
            onClick={() => handleSelectToolDrawing(Window)}
            disabled={optimizing}
          >
            <GiWindow />
            <div className="btn-title">
              <IntlMessages id="planner.window" />
            </div>
            <UncontrolledTooltip placement="right" target="planner-window">
              <IntlMessages id="planner.window" />
            </UncontrolledTooltip>
          </Button>

          <Button
            className={classNames({
              'toolbar-item': true,
              active:
                mode === plannerConstants.MODE_DRAWING_HOLE &&
                selectedElement &&
                selectedElement.name === Gate.name,
            })}
            id="planner-gate"
            onClick={() => handleSelectToolDrawing(Gate)}
            disabled={optimizing}
          >
            <GiGate />
            <div className="btn-title">
              <IntlMessages id="planner.gate" />
            </div>
            <UncontrolledTooltip placement="right" target="planner-gate">
              <IntlMessages id="planner.gate" />
            </UncontrolledTooltip>
          </Button>

          <Button
            className={classNames({
              'toolbar-item': true,
              active:
                mode === plannerConstants.MODE_WAITING_DRAWING_LINE &&
                selectedElement &&
                selectedElement.name === PerimeterWall.name,
            })}
            id="planner-perimeter-wall"
            onClick={() => handleSelectToolDrawing(PerimeterWall)}
            disabled={optimizing}
          >
            <GiBrickWall />
            <div className="btn-title">
              <IntlMessages id="planner.perimeter" />
            </div>
            <UncontrolledTooltip
              placement="right"
              target="planner-perimeter-wall"
            >
              <IntlMessages id="planner.perimeter-wall" />
            </UncontrolledTooltip>
          </Button>

          <Button
            className={classNames({
              'toolbar-item': true,
              active:
                mode === plannerConstants.MODE_WAITING_DRAWING_LINE &&
                selectedElement &&
                selectedElement.name === InteriorWall.name,
            })}
            id="planner-interior-wall"
            onClick={() => handleSelectToolDrawing(InteriorWall)}
            disabled={optimizing}
          >
            <GiBrickWall />
            <div className="btn-title">
              <IntlMessages id="planner.interior" />
            </div>
            <UncontrolledTooltip
              placement="right"
              target="planner-interior-wall"
            >
              <IntlMessages id="planner.interior-wall" />
            </UncontrolledTooltip>
          </Button>

          <Button
            className={classNames({
              'toolbar-item': true,
              active:
                mode === plannerConstants.MODE_WAITING_DRAWING_LINE &&
                selectedElement &&
                selectedElement.name === DividingWall.name,
            })}
            id="planner-dividing-wall"
            onClick={() => handleSelectToolDrawing(DividingWall)}
            disabled={optimizing}
          >
            <GiBrickWall />
            <div className="btn-title">
              <IntlMessages id="planner.dividing" />
            </div>
            <UncontrolledTooltip
              placement="right"
              target="planner-dividing-wall"
            >
              <IntlMessages id="planner.dividing-wall" />
            </UncontrolledTooltip>
          </Button>

          <Button
            className={classNames({
              'toolbar-item': true,
              active:
                mode === plannerConstants.MODE_WAITING_DRAWING_LINE &&
                selectedElement &&
                selectedElement.name === Separator.name,
            })}
            id="planner-separator"
            onClick={() => handleSelectToolDrawing(Separator)}
            disabled={optimizing}
          >
            <GiBrickWall />
            <div className="btn-title">
              <IntlMessages id="planner.separator" />
            </div>
            <UncontrolledTooltip placement="right" target="planner-separator">
              <IntlMessages id="planner.separator" />
            </UncontrolledTooltip>
          </Button>
        </div>

        <div className="button-group">
          <Button
            className="toolbar-item"
            id="planner-undo"
            onClick={() => projectActions.undo()}
            disabled={optimizing}
          >
            <MdUndo />
            <div className="btn-title">
              <IntlMessages id="planner.undo" />
            </div>
            <UncontrolledTooltip placement="right" target="planner-undo">
              <IntlMessages id="planner.undo" />
            </UncontrolledTooltip>
          </Button>

          <Button
            className="toolbar-item"
            id="planner-configure-project"
            onClick={() => projectActions.openProjectConfigurator()}
            disabled={optimizing}
          >
            <MdSettings />
            <div className="btn-title">
              <IntlMessages id="planner.configure-project" />
            </div>
            <UncontrolledTooltip
              placement="right"
              target="planner-configure-project"
            >
              <IntlMessages id="planner.configure-project" />
            </UncontrolledTooltip>
          </Button>

          <Button
            className="toolbar-item"
            id="planner-configure-canvas"
            onClick={() => projectActions.openCanvasConfigurator()}
            disabled={optimizing}
          >
            <MdSettings />
            <div className="btn-title">
              <IntlMessages id="planner.configure-canvas" />
            </div>
            <UncontrolledTooltip
              placement="right"
              target="planner-configure-canvas"
            >
              <IntlMessages id="planner.configure-canvas" />
            </UncontrolledTooltip>
          </Button>

          <Button
            className="toolbar-item"
            id="planner-optimization-bar"
            onClick={() => menuActions.toggleOptimizationBar()}
            disabled={optimizing}
          >
            <FaPlay />
            <div className="btn-title">
              <IntlMessages id="planner.optimization-bar" />
            </div>
            <UncontrolledTooltip
              placement="right"
              target="planner-optimization-bar"
            >
              <IntlMessages id="planner.optimization-bar" />
            </UncontrolledTooltip>
          </Button>
        </div>
      </div>
      <div className="flex-auto navbar-right">
        {loadedProject && loadedProject.name && (
          <Badge className="project-name-badge" color="secondary">
            {loadedProject.name}
          </Badge>
        )}
        <div className="d-inline-block">
          <UncontrolledDropdown className="ml-2">
            <DropdownToggle
              caret
              color="light"
              size="sm"
              className="language-button"
            >
              <span className="name">{locale.toUpperCase()}</span>
            </DropdownToggle>
            <DropdownMenu className="mt-3" right>
              {localeOptions.map((l) => {
                return (
                  <DropdownItem
                    onClick={() => handleChangeLocale(l.id, l.direction)}
                    key={l.id}
                  >
                    {l.name}
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
        <div className="header-icons d-inline-block align-middle">
          <TopnavEasyAccess />
          {/* <TopnavNotifications /> */}
          <button
            className="header-icon btn btn-empty d-none d-sm-inline-block"
            type="button"
            id="fullScreenButton"
            onClick={toggleFullScreen}
          >
            {isInFullScreen ? (
              <i className="simple-icon-size-actual d-block" />
            ) : (
              <i className="simple-icon-size-fullscreen d-block" />
            )}
          </button>
        </div>
        <div className="user d-inline-block">
          <TopNavProfileSection />
        </div>
      </div>
    </nav>
  );
};

const mapStateToProps = (state) => {
  const { menu, settings, planner, projects, authUser } = state;
  const { containerClassnames, menuClickCount, selectedMenuHasSubItems, loading, optimizeData } = menu;
  const { locale } = settings;
  const { loadedProject } = projects;
  const plannerState = getPlannerState(state);
  return {
    containerClassnames,
    menuClickCount,
    selectedMenuHasSubItems,
    locale,
    statePlanner: planner,
    loadedProject,
    userId: authUser.user,
    email: authUser.email,
    name: authUser.displayName,
    mode: plannerState.get('mode'),
    selectedElement: plannerState.get('selectedElementsHistory').first(),
    optimizing: loading.isLoading,
    optimizeData
  };
};

const mapDispatchToProps = (dispatch) => {
  const result = {
    localeActions: bindActionCreators(localeActionsAll, dispatch),
    ...objectsMap(actions, (actionNamespace) =>
      bindActionCreators(actions[actionNamespace], dispatch)
    ),
    plannerActions: bindActionCreators(plannerActionsAll, dispatch),
    menuActions: bindActionCreators(menuActionsAll, dispatch),
    optimizationActions: bindActionCreators(optimizationActionsAll, dispatch),
    showSaveProjectAsDialog: () => dispatch(openDialog('saveAsProjectDialog')),
    showExportSolutionsDialog: () =>
      dispatch(openDialog('exportSolutionsDialog')),
    saveRemoteProjectAction: (id, project, imageBlob) =>
      dispatch(saveRemoteProject(id, project, imageBlob)),
  };
  return result;
};

export default withRouter(
  injectIntl(connect(mapStateToProps, mapDispatchToProps)(TopNavPlanner))
);
