import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import * as _ from 'lodash';

import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  UncontrolledTooltip,
  Button,
  Badge
} from 'reactstrap';

import { MdUndo, MdSettings } from 'react-icons/md';
import { GiSteelDoor, GiWindow, GiGate, GiBrickWall } from 'react-icons/gi';
import { FaFolderOpen, FaFile, FaSave, FaFileExport, FaHome, FaPlay, FaFileDownload } from 'react-icons/fa';
import { AiOutlineBook } from 'react-icons/ai';
import { withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as localeActionsAll from '../../redux/settings/actions';
import * as plannerActionsAll from '../../redux/planner/actions';


import PerimeterWall from '../../catalog/lines/wall/planner-element';
import InteriorWall from '../../catalog/lines/interior-wall/planner-element';
import DividingWall from '../../catalog/lines/dividing-wall/planner-element';
import Door from '../../catalog/holes/door/planner-element';
import Window from '../../catalog/holes/window/planner-element';
import Gate from '../../catalog/holes/gate/planner-element';

import {
  localeOptions,
} from '../../constants/defaultValues';

import TopnavEasyAccess from './Topnav.EasyAccess';
import TopnavNotifications from './Topnav.Notifications';

import { getDirection, setDirection } from '../../helpers/Utils';
import { objectsMap } from '../../react-planner/utils/objects-utils';
import actions from '../../react-planner/actions/export';
import IntlMessages from '../../helpers/IntlMessages';
import { browserDownload, browserUpload } from '../../react-planner/utils/browser';
import { exportElementsCsv, exportRequirement, convertSceneToElements } from '../../react-planner/utils/csv-export';
import { THERMAL_REQUIREMENTS, FIRE_RESISTANCE_REQUIREMENTS, ACOUSTIC_REQUIREMENTS } from '../../react-planner/constants';
import { logoutUser, openDialog } from '../../redux/actions';
import { Project } from '../../react-planner/class/export';
import TopNavProfileSection from './TopNavProfileSection';
import { saveRemoteProject } from '../../redux/projects/actions';
import saveSVGScreenshotToFile from '../../helpers/Screenshot';

const TopNavPlanner = ({
  intl,
  locale,
  localeActions,
  projectActions,
  plannerActions,
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
  saveRemoteProjectAction
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
        state: projectState
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

  }

  const handleLoadProjectFromFile = () => {
    browserUpload().then((data) => {
      projectActions.loadProject(JSON.parse(data));
    });
  }

  const handleOptimize = () => {
    const state = statePlanner.get('react-planner');
    const { updatedState } = Project.unselectAll(state);
    const scene = updatedState.get('scene').toJS();
    const elements = convertSceneToElements(scene);
    plannerActions.optimizePlanner(userId, loadedProject.id, elements, email, name);
  }

  const handleSaveProjectElementsToFile = () => {
    const state = statePlanner.get('react-planner');
    const { updatedState } = Project.unselectAll(state);
    exportElementsCsv(updatedState.get('scene').toJS());
  }

  const handleSaveProjectRequirementsToFile = (type) => {
    const state = statePlanner.get('react-planner');
    const { updatedState } = Project.unselectAll(state);

    let translateType = 'planner.thermal-requirement';
    if (type === THERMAL_REQUIREMENTS) {
      translateType = intl.formatMessage({ id: 'planner.thermal-requirement' });
    } else if (type === FIRE_RESISTANCE_REQUIREMENTS) {
      translateType = intl.formatMessage({ id: 'planner.fire-resistance-requirement' });
    } else if (type === ACOUSTIC_REQUIREMENTS) {
      translateType = intl.formatMessage({ id: 'planner.acoustic-requirement' });
    }
    exportRequirement(updatedState.get('scene'), type, translateType);
  }

  const handleSelectToolDrawing = (element) => {
    projectActions.rollback();
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
  }

  return (
    <nav className="navbar fixed-top">
      <div size='lg' className="d-flex align-items-center navbar-left top-toolbar">
        <div className='button-group'>
          <Button id='planner-home' className='toolbar-item'
            onClick={() => history.push('/')}
          >
            <FaHome />
            <div className="btn-title" >
              <IntlMessages id='menu.home' />
            </div>
            <UncontrolledTooltip placement="right" target="planner-home" >
              <IntlMessages id='menu.home' />
            </UncontrolledTooltip>
          </Button>

          <Button id='planner-projects' className='toolbar-item'
            onClick={() => history.push('/projects')}
          >
            <AiOutlineBook />
            <div className="btn-title" >
              <IntlMessages id='menu.projects' />
            </div>
            <UncontrolledTooltip placement="right" target="planner-projects" >
              <IntlMessages id='menu.projects' />
            </UncontrolledTooltip>
          </Button>
        </div>

        <div className='button-group'>
          <Button id='planner-new-project' className='toolbar-item'
            onClick={() => projectActions.newProject()}
          >
            <FaFile />
            <div className="btn-title" >
              <IntlMessages id='planner.new' />
            </div>
            <UncontrolledTooltip placement="right" target="planner-new-project" >
              <IntlMessages id='planner.new-project' />
            </UncontrolledTooltip>
          </Button>

          <Button className='toolbar-item' id='planner-save-project'
            onClick={() => handleSaveProject()}
          >
            <FaSave />
            <div className="btn-title" >
              <IntlMessages id='planner.save' />
            </div>
            <UncontrolledTooltip placement="right" target="planner-save-project" >
              <IntlMessages id='planner.save-project' />
            </UncontrolledTooltip>
          </Button>

          <Button className='toolbar-item' id='planner-load-project'
            onClick={() => handleLoadProjectFromFile()}
          >
            <FaFolderOpen />
            <div className="btn-title" >
              <IntlMessages id='planner.load' />
            </div>
            <UncontrolledTooltip placement="right" target="planner-load-project" >
              <IntlMessages id='planner.load-project' />
            </UncontrolledTooltip>
          </Button>

          {loadedProject && (
            <Button className='toolbar-item' id='planner-optimize-project'
              onClick={() => handleOptimize()}
            >
              <FaPlay />
              <div className="btn-title" >
                <IntlMessages id='planner.optimize' />
              </div>
              <UncontrolledTooltip placement="right" target="planner-optimize-project" >
                <IntlMessages id='planner.optimize' />
              </UncontrolledTooltip>
            </Button>
          )}

          <Button className='toolbar-item' id='planner-export-project'
            onClick={() => handleSaveProjectElementsToFile()}
          >
            <FaFolderOpen />
            <div className="btn-title" >
              <IntlMessages id='planner.export' />
            </div>
            <UncontrolledTooltip placement="right" target="planner-export-project" >
              <IntlMessages id='planner.export-project' />
            </UncontrolledTooltip>
          </Button>

          <Button className='toolbar-item' id='planner-thermal-requirement'
            onClick={() => handleSaveProjectRequirementsToFile(THERMAL_REQUIREMENTS)}
          >
            <FaFileExport />
            <div className="btn-title" >
              <IntlMessages id='planner.thermal' />
            </div>
            <UncontrolledTooltip placement="right" target="planner-thermal-requirement" >
              <IntlMessages id='planner.thermal-requirement' />
            </UncontrolledTooltip>
          </Button>

          <Button className='toolbar-item' id='planner-fire-resistance-requirement'
            onClick={() => handleSaveProjectRequirementsToFile(FIRE_RESISTANCE_REQUIREMENTS)}
          >
            <FaFileExport />
            <div className="btn-title" >
              <IntlMessages id='planner.fire-resistance' />
            </div>
            <UncontrolledTooltip placement="right" target="planner-fire-resistance-requirement" >
              <IntlMessages id='planner.fire-resistance-requirement' />
            </UncontrolledTooltip>
          </Button>

          <Button className='toolbar-item' id='planner-acoustic-requirement'
            onClick={() => handleSaveProjectRequirementsToFile(ACOUSTIC_REQUIREMENTS)}
          >
            <FaFileExport />
            <div className="btn-title" >
              <IntlMessages id='planner.acoustic' />
            </div>
            <UncontrolledTooltip placement="right" target="planner-acoustic-requirement" >
              <IntlMessages id='planner.acoustic-requirement' />
            </UncontrolledTooltip>
          </Button>

          <Button className='toolbar-item' id='planner-export-solutions'
            onClick={() => showExportSolutionsDialog()}
          >
            <FaFileDownload />
            <div className="btn-title" >
              <IntlMessages id='planner.export-solutions' />
            </div>
            <UncontrolledTooltip placement="right" target="planner-export-solutions" >
              <IntlMessages id='planner.export-solutions' />
            </UncontrolledTooltip>
          </Button>
        </div>

        <div className='button-group'>
          <Button className='toolbar-item' id='planner-door'
            onClick={() => handleSelectToolDrawing(Door)}
          >
            <GiSteelDoor />
            <div className="btn-title" >
              <IntlMessages id='planner.door' />
            </div>
            <UncontrolledTooltip placement="right" target="planner-door" >
              <IntlMessages id='planner.door' />
            </UncontrolledTooltip>
          </Button>

          <Button className='toolbar-item' id='planner-window'
            onClick={() => handleSelectToolDrawing(Window)}
          >
            <GiWindow />
            <div className="btn-title" >
              <IntlMessages id='planner.window' />
            </div>
            <UncontrolledTooltip placement="right" target="planner-window" >
              <IntlMessages id='planner.window' />
            </UncontrolledTooltip>
          </Button>

          <Button className='toolbar-item' id='planner-gate'
            onClick={() => handleSelectToolDrawing(Gate)}
          >
            <GiGate />
            <div className="btn-title" >
              <IntlMessages id='planner.gate' />
            </div>
            <UncontrolledTooltip placement="right" target="planner-gate" >
              <IntlMessages id='planner.gate' />
            </UncontrolledTooltip>
          </Button>

          <Button className='toolbar-item' id='planner-perimeter-wall'
            onClick={() => handleSelectToolDrawing(PerimeterWall)}
          >
            <GiBrickWall />
            <div className="btn-title" >
              <IntlMessages id='planner.perimeter' />
            </div>
            <UncontrolledTooltip placement="right" target="planner-perimeter-wall" >
              <IntlMessages id='planner.perimeter-wall' />
            </UncontrolledTooltip>
          </Button>

          <Button className='toolbar-item' id='planner-interior-wall'
            onClick={() => handleSelectToolDrawing(InteriorWall)}
          >
            <GiBrickWall />
            <div className="btn-title" >
              <IntlMessages id='planner.interior' />
            </div>
            <UncontrolledTooltip placement="right" target="planner-interior-wall" >
              <IntlMessages id='planner.interior-wall' />
            </UncontrolledTooltip>
          </Button>

          <Button className='toolbar-item' id='planner-dividing-wall'
            onClick={() => handleSelectToolDrawing(DividingWall)}
          >
            <GiBrickWall />
            <div className="btn-title" >
              <IntlMessages id='planner.dividing' />
            </div>
            <UncontrolledTooltip placement="right" target="planner-dividing-wall" >
              <IntlMessages id='planner.dividing-wall' />
            </UncontrolledTooltip>
          </Button>

          <Button className='toolbar-item' id='planner-separator'
            onClick={() => handleSelectToolDrawing(DividingWall)}
          >
            <GiBrickWall />
            <div className="btn-title" >
              <IntlMessages id='planner.separator' />
            </div>
            <UncontrolledTooltip placement="right" target="planner-separator" >
              <IntlMessages id='planner.separator' />
            </UncontrolledTooltip>
          </Button>
        </div>

        <div className='button-group'>

          <Button className='toolbar-item' id='planner-undo'
            onClick={() => projectActions.undo()}
          >
            <MdUndo />
            <div className="btn-title" >
              <IntlMessages id='planner.undo' />
            </div>
            <UncontrolledTooltip placement="right" target="planner-undo" >
              <IntlMessages id='planner.undo' />
            </UncontrolledTooltip>
          </Button>

          <Button className='toolbar-item' id='planner-configure-project'
            onClick={() => projectActions.openProjectConfigurator()}
          >
            <MdSettings />
            <div className="btn-title" >
              <IntlMessages id='planner.configure-project' />
            </div>
            <UncontrolledTooltip placement="right" target="planner-configure-project" >
              <IntlMessages id='planner.configure-project' />
            </UncontrolledTooltip>
          </Button>

          <Button className='toolbar-item' id='planner-configure-canvas'
            onClick={() => projectActions.openCanvasConfigurator()}
          >
            <MdSettings />
            <div className="btn-title" >
              <IntlMessages id='planner.configure-canvas' />
            </div>
            <UncontrolledTooltip placement="right" target="planner-configure-canvas" >
              <IntlMessages id='planner.configure-canvas' />
            </UncontrolledTooltip>
          </Button>
        </div>

      </div>
      <div className="flex-auto navbar-right">
        {
          loadedProject && loadedProject.name &&
          (
            <Badge className="project-name-badge" color="secondary">{loadedProject.name}</Badge>
          )
        }
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
    </nav >
  );
};

const mapStateToProps = ({ menu, settings, planner, projects, authUser }) => {
  const { containerClassnames, menuClickCount, selectedMenuHasSubItems } = menu;
  const { locale } = settings;
  const { loadedProject } = projects;
  return {
    containerClassnames,
    menuClickCount,
    selectedMenuHasSubItems,
    locale,
    statePlanner: planner,
    loadedProject,
    userId: authUser.user,
    email: authUser.email,
    name: authUser.displayName
  };
};

const mapDispatchToProps = (dispatch) => {
  const result = {
    localeActions: bindActionCreators(localeActionsAll, dispatch),
    ...objectsMap(actions, actionNamespace => bindActionCreators(actions[actionNamespace], dispatch)),
    plannerActions: bindActionCreators(plannerActionsAll, dispatch),
    showSaveProjectAsDialog: () => dispatch(openDialog('saveAsProjectDialog')),
    showExportSolutionsDialog: () => dispatch(openDialog('exportSolutionsDialog')),
    saveRemoteProjectAction: (id, project, imageBlob) => dispatch(saveRemoteProject(id, project, imageBlob))
  }
  return result;
};

export default withRouter(injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(TopNavPlanner))
);
