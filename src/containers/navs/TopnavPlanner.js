import React, { useState } from 'react';
import { injectIntl } from 'react-intl';

import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  UncontrolledTooltip,
  UncontrolledButtonDropdown,
  Button
} from 'reactstrap';

import { MdUndo, MdSettings } from 'react-icons/md';
import { GiSteelDoor, GiWindow, GiGate, GiBrickWall } from 'react-icons/gi';
import { FaFolderOpen, FaFile, FaSave, FaFileExport } from 'react-icons/fa';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as localeActionsAll from '../../redux/settings/actions';

import PerimeterWall from '../../catalog/lines/wall/planner-element';
import InteriorWall from '../../catalog/lines/interior-wall/planner-element';
import DividingWall from '../../catalog/lines/dividing-wall/planner-element';
import Separator from '../../catalog/lines/separator/planner-element';
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
import SplitButton from '../../components/common/SplitButton';
import IntlMessages from '../../helpers/IntlMessages';
import { Project } from '../../react-planner/class/export';
import { browserDownload, browserUpload } from '../../react-planner/utils/browser';
import { exportElementsCsv, exportRequirement } from '../../react-planner/utils/csv-export';
import { THERMAL_REQUIREMENTS, FIRE_RESISTANCE_REQUIREMENTS, ACOUSTIC_REQUIREMENTS } from '../../react-planner/constants';



const TopNavPlanner = ({
  intl,
  locale,
  localeActions,
  projectActions,
  linesActions,
  holesActions,
  itemsActions,
  statePlanner
}) => {
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

  const handleLogout = () => {
    console.log('logout');
  };

  const handleSaveProject = () => {
    const state = statePlanner.get('react-planner');
    const { updatedState } = Project.unselectAll(state).updatedState;
    browserDownload(updatedState.get('scene').toJS());
  }

  const handleLoadProjectFromFile = () => {
    browserUpload().then((data) => {
      projectActions.loadProject(JSON.parse(data));
    });
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
    exportRequirement(updatedState.get('scene').toJS(), type, translateType);
  }

  const handleSelectToolDrawing = (element) => {
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
          onClick={() => handleSaveProjectElementsToFile(THERMAL_REQUIREMENTS)}
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
          onClick={() => handleSaveProjectElementsToFile(FIRE_RESISTANCE_REQUIREMENTS)}
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
          onClick={() => handleSaveProjectElementsToFile(ACOUSTIC_REQUIREMENTS)}
        >
          <FaFileExport />
          <div className="btn-title" >
            <IntlMessages id='planner.acoustic' />
          </div>
          <UncontrolledTooltip placement="right" target="planner-acoustic-requirement" >
            <IntlMessages id='planner.acoustic-requirement' />
          </UncontrolledTooltip>
        </Button>

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
      <div className="flex-auto navbar-right">
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
          {/* <TopnavEasyAccess /> */}
          <TopnavNotifications />
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
          <UncontrolledDropdown className="dropdown-menu-right">
            <DropdownToggle className="p-0" color="empty">
              <span className="name mr-1">Sarah Kortney</span>
              <span>
                <img alt="Profile" src="/assets/img/profiles/l-1.jpg" />
              </span>
            </DropdownToggle>
            <DropdownMenu className="mt-3" right>
              <DropdownItem>Account</DropdownItem>
              <DropdownItem>Features</DropdownItem>
              <DropdownItem>History</DropdownItem>
              <DropdownItem>Support</DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={() => handleLogout()}>
                Sign out
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </div>
    </nav >
  );
};

const mapStateToProps = ({ menu, settings, planner }) => {
  const { containerClassnames, menuClickCount, selectedMenuHasSubItems } = menu;
  const { locale } = settings;
  return {
    containerClassnames,
    menuClickCount,
    selectedMenuHasSubItems,
    locale,
    statePlanner: planner
  };
};

const mapDispatchToProps = (dispatch) => {
  const result = {
    localeActions: bindActionCreators(localeActionsAll, dispatch),
    ...objectsMap(actions, actionNamespace => bindActionCreators(actions[actionNamespace], dispatch))
  }
  return result;
};

export default withRouter(injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(TopNavPlanner))
);
