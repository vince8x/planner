import React, { Component } from 'react';
import PropTypes from 'prop-types';
import polylabel from 'polylabel';
import areapolygon from 'area-polygon';
import * as _ from 'lodash';

import {
  ContentTitle,
  ContentContainer,
  FormLabel,
  FormBlock,
  FormSubmitButton,
  CancelButton,
  FormTextInput
} from '../style/export';
import IntlMessages from '../../../helpers/IntlMessages';
import calculateArea from '../../utils/calculation';

export default class CanvasConfigurator extends Component {

  constructor(props, context) {
    super(props, context);

    const { scene } = props.state;
    const layers = scene.get('layers');

    // calculate the area
    let totalAreaSize = 0;
    layers.map(layer => {
      layer.areas.map(area => {
        totalAreaSize = calculateArea(area, layer);
      });

    });

    this.state = {
      dataWidth: scene.width,
      dataHeight: scene.height,
      dataDefaultWallWidth: scene.defaultWallWidth || 20
    };


  }

  onSubmit(event) {
    event.preventDefault();

    let { projectActions } = this.context;

    let {
      dataWidth, dataHeight, dataDefaultWallWidth
    } = this.state;
    dataHeight = _.isNumber(parseInt(dataHeight)) ? parseInt(dataHeight) : 2000;
    dataWidth = _.isNumber(parseInt(dataWidth)) ? parseInt(dataWidth) : 3000;
    dataDefaultWallWidth = _.isNumber(parseInt(dataDefaultWallWidth)) ? parseInt(dataDefaultWallWidth) : 20;

    if (dataWidth <= 100 || dataHeight <= 100) {
      alert('Scene size too small');
    } else {
      projectActions.setProjectProperties({
        width: dataWidth,
        height: dataHeight,
        defaultWallWidth: dataDefaultWallWidth
      });
    }
  }

  render() {
    let { width, height } = this.props;
    let {
      dataWidth, dataHeight
    } = this.state;
    let { projectActions } = this.context;



    return (
      <ContentContainer width={width} height={height}>
        <ContentTitle><IntlMessages id='planner.canvas-config' /></ContentTitle>

        <form onSubmit={e => this.onSubmit(e)}>
          <FormBlock>
            <FormLabel htmlFor='height'><IntlMessages id='planner.canvas-width' /></FormLabel>
            <FormTextInput
              id='width'
              placeholder='width'
              value={dataWidth}
              onChange={e => this.setState({ dataWidth: e.target.value })}
            />
          </FormBlock>

          <FormBlock>
            <FormLabel htmlFor='height'>
              <IntlMessages id='planner.canvas-height' />
            </FormLabel>
            <FormTextInput
              id='height'
              placeholder='height'
              value={dataHeight}
              onChange={e => this.setState({ dataHeight: e.target.value })}
            />
          </FormBlock>

          <table style={{ float: 'right' }}>
            <tbody>
              <tr>
                <td>
                  <CancelButton size='large'
                    onClick={e => projectActions.rollback()}>
                    <IntlMessages id='planner.cancel' />
                  </CancelButton>
                </td>
                <td>
                  <FormSubmitButton size='large'>
                    <IntlMessages id='planner.save' />
                  </FormSubmitButton>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </ContentContainer>
    )
  }
}

CanvasConfigurator.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  state: PropTypes.object.isRequired,
};

CanvasConfigurator.contextTypes = {
  projectActions: PropTypes.object.isRequired,
  translator: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired
};
