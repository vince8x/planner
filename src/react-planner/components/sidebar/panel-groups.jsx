import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Panel from './panel';
import * as SharedStyle from '../../shared-style';
import {TiPlus, TiDelete} from 'react-icons/ti';
import {FaTrash, FaEye, FaLink, FaUnlink} from 'react-icons/fa';
import { Map } from 'immutable';

import {
  MODE_IDLE, MODE_2D_ZOOM_IN, MODE_2D_ZOOM_OUT, MODE_2D_PAN, MODE_3D_VIEW, MODE_3D_FIRST_PERSON,
  MODE_WAITING_DRAWING_LINE, MODE_DRAWING_LINE, MODE_DRAWING_HOLE, MODE_DRAWING_ITEM, MODE_DRAGGING_LINE,
  MODE_DRAGGING_VERTEX, MODE_DRAGGING_ITEM, MODE_DRAGGING_HOLE, MODE_FITTING_IMAGE, MODE_UPLOADING_IMAGE,
  MODE_ROTATING_ITEM
} from '../../constants';
import IntlMessages from '../../../helpers/IntlMessages';

const VISIBILITY_MODE = {
  MODE_IDLE, MODE_2D_ZOOM_IN, MODE_2D_ZOOM_OUT, MODE_2D_PAN, MODE_3D_VIEW, MODE_3D_FIRST_PERSON,
  MODE_WAITING_DRAWING_LINE, MODE_DRAWING_LINE, MODE_DRAWING_HOLE, MODE_DRAWING_ITEM, MODE_DRAGGING_LINE,
  MODE_DRAGGING_VERTEX, MODE_DRAGGING_ITEM, MODE_DRAGGING_HOLE, MODE_FITTING_IMAGE, MODE_UPLOADING_IMAGE,
  MODE_ROTATING_ITEM
};

const styleEditButton = {
  marginLeft: '5px',
  borderWidth: '0px',
  background: 'none',
  color: SharedStyle.COLORS.white,
  fontSize: '14px',
  outline: '0px'
};

const tablegroupStyle = {
  width: '100%',
  cursor: 'pointer',
  maxHeight: '20em',
  padding: '0 1em',
  marginLeft: '1px'
};

const iconColStyle = {width: '2em', textAlign: 'center'};
const styleHoverColor = {color: SharedStyle.SECONDARY_COLOR.main};
const styleEditButtonHover = {...styleEditButton, ...styleHoverColor};
const styleAddLabel = {fontSize: '10px', marginLeft: '5px'};
const styleEyeVisible = {fontSize: '1.25em'};
const styleEyeHidden = {...styleEyeVisible, color: '#a5a1a1'};
const newLayerLableStyle = {fontSize: '1.3em', cursor: 'pointer', textAlign: 'center'};
const newLayerLableHoverStyle = {...newLayerLableStyle, ...styleHoverColor};

export default class PanelGroups extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      newEmptyHover: false,
      newSelectedHover: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return ( 
      this.props.groups.hashCode() !== nextProps.groups.hashCode() ||
      this.props.layers.hashCode() !== nextProps.layers.hashCode() ||
      this.props.mode !== nextProps.mode
    );
  }

  render() {
    let { mode, groups, layers } = this.props;

    let { intl } = this.context;

    if (!VISIBILITY_MODE[ mode ]) return null;

    return (
      <Panel name={intl.formatMessage({ id: 'planner.groups' })} opened={groups.size > 0}>
        { groups.size ? <table style={tablegroupStyle}>
          <thead>
            <tr>
              <th colSpan="4"></th>
              <th>
                <IntlMessages id='planner.elements' />
              </th>
              <th>
                <IntlMessages id='planner.name' />
              </th>
            </tr>
          </thead>
          <tbody>
            {
              groups.entrySeq().map(([ groupID, group ]) => {

                let selectClick = e => this.context.groupsActions.selectGroup(groupID);

                let swapVisibility = e => {
                  e.stopPropagation();
                  this.context.groupsActions.setGroupProperties(groupID, new Map({visible: !group.get('visible')}));
                };

                let chainToGroup = e => {
                  layers.forEach((layer) => {

                    let layerID = layer.get('id');
                    let layerElements = {
                      'lines': layer.get('lines'),
                      'items': layer.get('items'),
                      'holes': layer.get('holes'),
                      'areas': layer.get('areas')
                    };

                    for( let elementPrototype in layerElements )
                    {
                      let ElementList = layerElements[elementPrototype];
                      ElementList.filter( el => el.get('selected') ).forEach( element => {
                        this.context.groupsActions.addToGroup( groupID, layerID, elementPrototype, element.get('id') );
                      });
                    }
                  });

                  selectClick(e);
                };

                let isCurrentgroup = group.get('selected');
                let shouldHighlight = isCurrentgroup;
                let rowStyle = !shouldHighlight ? null : styleHoverColor;

                let dimension = group.get('elements').reduce( ( sum, layer ) => {
                  return sum + layer.reduce( ( lSum, elProt ) => lSum + elProt.size, 0 );
                }, 0);

                return (
                  <tr
                    key={groupID}
                    style={rowStyle}
                  >
                    <td style={iconColStyle} title={intl.formatMessage({ id: 'planner.toggle-group-visibility' })}>
                      <FaEye
                        onClick={swapVisibility}
                        style={!group.get('visible') ? styleEyeHidden : styleEyeVisible}
                      />
                    </td>
                    <td style={iconColStyle} title={intl.formatMessage({ id: 'planner.Groups' })}>
                      <FaLink
                        onClick={chainToGroup}
                        style={!shouldHighlight ? styleEditButton : styleEditButtonHover}
                      />
                    </td>
                    <td style={iconColStyle} title={intl.formatMessage({ id: 'planner.un-chain-all-group-elements-and-remove-group' })}>
                      <FaUnlink
                        onClick={ e => this.context.groupsActions.removeGroup(groupID) }
                        style={!shouldHighlight ? styleEditButton : styleEditButtonHover}
                      />
                    </td>
                    <td style={iconColStyle} title={intl.formatMessage({ id: 'planner.delete-group-and-all-elements' })}>
                      <FaTrash
                        onClick={ e => this.context.groupsActions.removeGroupAndDeleteElements(groupID) }
                        style={!shouldHighlight ? styleEditButton : styleEditButtonHover}
                      />
                    </td>
                    <td onClick={selectClick} style={{width:'0em', textAlign:'center'}}>
                      { dimension }
                    </td>
                    <td onClick={selectClick}>
                      {group.get('name')}
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table> : null }

        <table style={{width:'100%', marginTop: '0.1em'}}>
          <tbody>
            <tr>
              <td
                style={ !this.state.newEmptyHover ? newLayerLableStyle : newLayerLableHoverStyle }
                onMouseOver={ () => this.setState({newEmptyHover: true}) }
                onMouseOut={ () => this.setState({newEmptyHover: false}) }
                onClick={ e => this.context.groupsActions.addGroup() }
              >
                <TiPlus />
                <b style={styleAddLabel}>
                  <IntlMessages id='planner.new-empty-group' />
                </b>
              </td>
              <td
                style={ !this.state.newSelectedHover ? newLayerLableStyle : newLayerLableHoverStyle }
                onMouseOver={ () => this.setState({newSelectedHover: true}) }
                onMouseOut={ () => this.setState({newSelectedHover: false}) }
                onClick={ e => this.context.groupsActions.addGroupFromSelected() }
              >
                <TiPlus />
                <b style={styleAddLabel}>
                  <IntlMessages id='new-group-from-selected' />
                </b>
              </td>
            </tr>
          </tbody>
        </table>

      </Panel>
    )
  }

}

PanelGroups.propTypes = {
  mode: PropTypes.string.isRequired,
  groups: PropTypes.object.isRequired,
  layers: PropTypes.object.isRequired
};

PanelGroups.contextTypes = {
  catalog: PropTypes.object.isRequired,
  translator: PropTypes.object.isRequired,
  itemsActions: PropTypes.object.isRequired,
  linesActions: PropTypes.object.isRequired,
  holesActions: PropTypes.object.isRequired,
  groupsActions: PropTypes.object.isRequired,
  projectActions: PropTypes.object.isRequired
};
