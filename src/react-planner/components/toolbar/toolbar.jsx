import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdSettings, MdUndo, MdDirectionsRun } from 'react-icons/md';
import { FaFile, FaMousePointer, FaPlus } from 'react-icons/fa';
import ToolbarButton from './toolbar-button';
import ToolbarSaveButton from './toolbar-save-button';
import ToolbarLoadButton from './toolbar-load-button';
import ToolbarExportButton from './toolbar-export-button';
import If from '../../utils/react-if';
import {
  MODE_IDLE,
  MODE_3D_VIEW,
  MODE_3D_FIRST_PERSON,
  MODE_VIEWING_CATALOG,
  MODE_CONFIGURING_PROJECT,
  THERMAL_REQUIREMENTS,
  FIRE_RESISTANCE_REQUIREMENTS,
  ACOUSTIC_REQUIREMENTS
} from '../../constants';
import * as SharedStyle from '../../shared-style';
import ToolbarExportFilterButton from './toolbar-export-filter-button';

const iconTextStyle = {
  fontSize: '19px',
  textDecoration: 'none',
  fontWeight: 'bold',
  margin: '0px',
  userSelect: 'none'
};

const Icon2D = ( {style} ) => <p style={{...iconTextStyle, ...style}}>2D</p>;
const Icon3D = ( {style} ) => <p style={{...iconTextStyle, ...style}}>3D</p>;

const ASIDE_STYLE = {
  backgroundColor: SharedStyle.PRIMARY_COLOR.main,
  padding: '10px'
};

const sortButtonsCb = (a, b) => {
  if (a.index === undefined || a.index === null) {
    a.index = Number.MAX_SAFE_INTEGER;
  }

  if (b.index === undefined || b.index === null) {
    b.index = Number.MAX_SAFE_INTEGER;
  }

  return a.index - b.index;
};

const mapButtonsCb = (el, ind) => {
  return (
    <If
      key={ind}
      condition={el.condition}
      style={{ position: 'relative' }}
    >
      {el.dom}
    </If>
  );
};

export default class Toolbar extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.isRefersh === true) {
      this.isRefersh = false;
      return true;
    }
    return this.props.state.mode !== nextProps.state.mode ||
      this.props.height !== nextProps.height ||
      this.props.width !== nextProps.width ||
      this.props.state.alterate !== nextProps.state.alterate;
  }

  componentWillMount() {
    this.isRefersh = true;
  }

  render() {

    let {
      props: { state, width, height, toolbarButtons, allowProjectFileSupport },
      context: { projectActions, viewer3DActions, translator, intl }
    } = this;

    let mode = state.get('mode');
    let alterate = state.get('alterate');
    let alterateColor = alterate ? SharedStyle.MATERIAL_COLORS[500].orange : '';

    let sorter = [
      {
        index: 0, condition: allowProjectFileSupport, dom: <ToolbarButton
          active={false}
          tooltip={intl.formatMessage({ id: 'planner.new-project' })}
          onClick={() => projectActions.newProject() }>
          <FaFile />
        </ToolbarButton>
      },
      {
        index: 1, condition: allowProjectFileSupport,
        dom: <ToolbarSaveButton state={state} />
      },
      {
        index: 2, condition: allowProjectFileSupport,
        dom: <ToolbarLoadButton state={state} />
      },
      {
        index: 3, condition: allowProjectFileSupport,
        dom: <ToolbarExportButton state={state} />
      },
      {
        index: 4, condition: true,
        dom: <ToolbarButton
          active={[MODE_VIEWING_CATALOG].includes(mode)}
          tooltip={intl.formatMessage({ id: 'planner.open-catalog' })}
          onClick={event => projectActions.openCatalog()}>
          <FaPlus />
        </ToolbarButton>
      },
      /*
      {
        index: 4, condition: true, dom: <ToolbarButton
          active={[MODE_3D_VIEW].includes(mode)}
          tooltip={translator.t('3D View')}
          onClick={event => viewer3DActions.selectTool3DView()}>
          <Icon3D />
        </ToolbarButton>
      },
      {
        index: 5, condition: true, dom: <ToolbarButton
          active={[MODE_IDLE].includes(mode)}
          tooltip={translator.t('2D View')}
          onClick={event => projectActions.setMode( MODE_IDLE )}>
          {[MODE_3D_FIRST_PERSON, MODE_3D_VIEW].includes(mode) ? <Icon2D style={{color: alterateColor}} /> : <FaMousePointer style={{color: alterateColor}} />}
        </ToolbarButton>
      },
      {
        index: 6, condition: true, dom: <ToolbarButton
          active={[MODE_3D_FIRST_PERSON].includes(mode)}
          tooltip={translator.t('3D First Person')}
          onClick={event => viewer3DActions.selectTool3DFirstPerson()}>
          <MdDirectionsRun />
        </ToolbarButton>
      },
      */
      {
        index: 7, condition: true, dom: <ToolbarButton
          active={false}
          tooltip={intl.formatMessage({ id: 'planner.undo' })}
          onClick={event => projectActions.undo()}>
          <MdUndo />
        </ToolbarButton>
      },
      {
        index: 8, condition: true, dom: <ToolbarButton
          active={[MODE_CONFIGURING_PROJECT].includes(mode)}
          tooltip={intl.formatMessage({ id: 'planner.configure-project' })}
          onClick={event => projectActions.openProjectConfigurator()}>
          <MdSettings />
        </ToolbarButton>
      },
      {
        index: 9, condition: true,
        dom: <ToolbarExportFilterButton state={state} type={THERMAL_REQUIREMENTS} />
      },
      {
        index: 10, condition: true,
        dom: <ToolbarExportFilterButton state={state} type={FIRE_RESISTANCE_REQUIREMENTS} />
      },
      {
        index: 11, condition: true,
        dom: <ToolbarExportFilterButton state={state} type={ACOUSTIC_REQUIREMENTS} />
      }
    ];

    sorter = sorter.concat(toolbarButtons.map((Component, key) => {
      return Component.prototype ? //if is a react component
        {
          condition: true,
          dom: React.createElement(Component, { mode, state, key })
        } :
        {                           //else is a sortable toolbar button
          index: Component.index,
          condition: Component.condition,
          dom: React.createElement(Component.dom, { mode, state, key })
        };
    }));

    return (
      <aside style={{ ...ASIDE_STYLE, maxWidth: width, maxHeight: height }} className='toolbar'>
        {sorter.sort(sortButtonsCb).map(mapButtonsCb)}
      </aside>
    )
  }
}

Toolbar.propTypes = {
  state: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  allowProjectFileSupport: PropTypes.bool.isRequired,
  toolbarButtons: PropTypes.array
};

Toolbar.contextTypes = {
  projectActions: PropTypes.object.isRequired,
  viewer2DActions: PropTypes.object.isRequired,
  viewer3DActions: PropTypes.object.isRequired,
  linesActions: PropTypes.object.isRequired,
  holesActions: PropTypes.object.isRequired,
  itemsActions: PropTypes.object.isRequired,
  translator: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
};
