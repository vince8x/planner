import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { 
  MdAddCircle, 
  MdWarning 
} from 'react-icons/md';
import If from '../../utils/react-if';
import FooterToggleButton from './footer-toggle-button';
import FooterContentButton from './footer-content-button';
import { SNAP_POINT, SNAP_LINE, SNAP_SEGMENT, SNAP_GRID, SNAP_GUIDE } from '../../utils/snap';
import { MODE_SNAPPING } from '../../constants';
import * as SharedStyle from '../../shared-style';
import { VERSION } from '../../version';
import IntlMessages from '../../../helpers/IntlMessages';

const footerBarStyle = {
  position: 'absolute',
  bottom: 0,
  lineHeight: '14px',
  fontSize: '12px',
  color: SharedStyle.COLORS.white,
  backgroundColor: SharedStyle.SECONDARY_COLOR.alt,
  padding: '3px 1em',
  margin: 0,
  boxSizing: 'border-box',
  cursor: 'default',
  userSelect: 'none',
  zIndex: '1001'
};

export const leftTextStyle = {
  position: 'relative',
  borderRight: '1px solid #FFF',
  float: 'left',
  padding: '0 1em',
  display: 'inline-block'
};

export const rightTextStyle = {
  position: 'relative',
  borderLeft: '1px solid #FFF',
  float: 'right',
  padding: '0 1em',
  display: 'inline-block'
};

const coordStyle = {
  display: 'inline-block',
  width: '6em',
  margin: 0,
  padding: 0
};

const appMessageStyle = { borderBottom: '1px solid #555', lineHeight: '1.5em' };

export default class FooterBar extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  render() {
    const { state: globalState, width, height } = this.props;
    const { projectActions, intl } = this.context;
    const { x, y } = globalState.get('mouse').toJS();
    const zoom = globalState.get('zoom');
    const mode = globalState.get('mode');

    const errors = globalState.get('errors').toArray();
    const errorsJsx = errors.map((err, ind) =>
      <div key={ind} style={appMessageStyle}>[ {(new Date(err.date)).toLocaleString()} ] {err.error}</div>
    );
    const errorLableStyle = errors.length ? { color: SharedStyle.MATERIAL_COLORS[500].red } : {};
    const errorIconStyle = errors.length ? { transform: 'rotate(45deg)', color: SharedStyle.MATERIAL_COLORS[500].red } : { transform: 'rotate(45deg)' };

    const warnings = globalState.get('warnings').toArray();
    const warningsJsx = warnings.map((warn, ind) =>
      <div key={ind} style={appMessageStyle}>[ {(new Date(warn.date)).toLocaleString()} ] {warn.warning}</div>
    );
    const warningLableStyle = warnings.length ? { color: SharedStyle.MATERIAL_COLORS[500].yellow } : {};
    const warningIconStyle = warningLableStyle;

    const updateSnapMask = (val) => projectActions.toggleSnap(globalState.snapMask.merge(val));

    return (
      <div style={{ ...footerBarStyle, width, height }}>

        <If condition={MODE_SNAPPING.includes(mode)}>
          <div style={leftTextStyle}>
            <div title={intl.formatMessage({id:'planner.mouse-x-coordinate'})} style={coordStyle}>
              X : {x.toFixed(3)}
            </div>
            <div title={intl.formatMessage({id:'planner.mouse-y-coordinate'})} style={coordStyle}>Y : {y.toFixed(3)}</div>
          </div>

          <div style={leftTextStyle} title={intl.formatMessage({id:'planner.scene-zoom-level'})}>Zoom: {zoom.toFixed(3)}X</div>

          <div style={leftTextStyle}>
            <FooterToggleButton
              state={this.state}
              toggleOn={() => { updateSnapMask({ SNAP_ORTHO: true }); }}
              toggleOff={() => { updateSnapMask({ SNAP_ORTHO: false }); }}
              text="Ortho"
              toggleState={globalState.snapMask.get(SNAP_POINT)}
              title={intl.formatMessage({id:'planner.orthogonal'})}
            />
            <FooterToggleButton
              state={this.state}
              toggleOn={() => { updateSnapMask({ SNAP_POINT: true }); }}
              toggleOff={() => { updateSnapMask({ SNAP_POINT: false }); }}
              text="Snap PT"
              toggleState={globalState.snapMask.get(SNAP_POINT)}
              title={intl.formatMessage({id:'planner.snap-to-point'})}
            />
            <FooterToggleButton
              state={this.state}
              toggleOn={() => { updateSnapMask({ SNAP_LINE: true }); }}
              toggleOff={() => { updateSnapMask({ SNAP_LINE: false }); }}
              text="Snap LN"
              toggleState={globalState.snapMask.get(SNAP_LINE)}
              title={intl.formatMessage({id:'planner.snap-to-line'})}
            />
            <FooterToggleButton
              state={this.state}
              toggleOn={() => { updateSnapMask({ SNAP_SEGMENT: true }); }}
              toggleOff={() => { updateSnapMask({ SNAP_SEGMENT: false }); }}
              text="Snap SEG"
              toggleState={globalState.snapMask.get(SNAP_SEGMENT)}
              title={intl.formatMessage({id:'planner.snap-to-segment'})}
            />
            <FooterToggleButton
              state={this.state}
              toggleOn={() => { updateSnapMask({ SNAP_GRID: true }); }}
              toggleOff={() => { updateSnapMask({ SNAP_GRID: false }); }}
              text="Snap GRD"
              toggleState={globalState.snapMask.get(SNAP_GRID)}
              title={intl.formatMessage({id:'planner.snap-to-grid'})}
            />
            <FooterToggleButton
              state={this.state}
              toggleOn={() => { updateSnapMask({ SNAP_GUIDE: true }); }}
              toggleOff={() => { updateSnapMask({ SNAP_GUIDE: false }); }}
              text="Snap GDE"
              toggleState={globalState.snapMask.get(SNAP_GUIDE)}
              title={intl.formatMessage({id:'planner.snap-to-guide'})}
            />
          </div>
        </If>

        {this.props.footerbarComponents.map((Component, index) => <Component state={this.state} key={index} />)}

        {
          this.props.softwareSignature ?
            <div
              style={rightTextStyle}
              title={this.props.softwareSignature + (this.props.softwareSignature.includes('DEODEM UC') ? '' : ` using DEODEM UC ${VERSION}`)}
            >
              {this.props.softwareSignature}
            </div>
            : null
        }

        <div style={rightTextStyle}>
          <FooterContentButton
            state={this.state}
            icon={MdAddCircle}
            iconStyle={errorIconStyle}
            text={errors.length.toString()}
            textStyle={errorLableStyle}
            title={`Errors [ ${errors.length} ]`}
            titleStyle={errorLableStyle}
            content={[errorsJsx]}
          />
          <FooterContentButton
            state={this.state}
            icon={MdWarning}
            iconStyle={warningIconStyle}
            text={warnings.length.toString()}
            textStyle={warningLableStyle}
            title={`Warnings [ ${warnings.length} ]`}
            titleStyle={warningLableStyle}
            content={[warningsJsx]}
          />
        </div>

      </div>
    );
  }
}

FooterBar.propTypes = {
  state: PropTypes.object.isRequired,
  footerbarComponents: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  softwareSignature: PropTypes.string
};

FooterBar.contextTypes = {
  projectActions: PropTypes.object.isRequired,
  viewer2DActions: PropTypes.object.isRequired,
  viewer3DActions: PropTypes.object.isRequired,
  linesActions: PropTypes.object.isRequired,
  holesActions: PropTypes.object.isRequired,
  itemsActions: PropTypes.object.isRequired,
  translator: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired
};
