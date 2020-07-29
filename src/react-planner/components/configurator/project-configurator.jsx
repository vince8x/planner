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
  FormSelect,
  FormNumberInput,
  FormSubmitButton,
  CancelButton,
  FormTextInput
} from '../style/export';
import { THERMAL_REGULATION, CURRENT_THERMAL_REGULATION, VENTILATED } from '../../constants';
import { TYPE_OF_GROUPING, NUMBER_OF_FLOORS, FIRST_FLOOR_TYPE, ISOLATE_BUILDING, FUTURE_THERMAL_REGULATION } from './../../constants';
import { futureThermalZoneData } from './../../data/thermal-regulations/future';
import { currentThermalZoneData } from './../../data/thermal-regulations/current';

export default class ProjectConfigurator extends Component {

  constructor(props, context) {
    super(props, context);

    let scene = props.state.scene;
    const layers = scene.get('layers');

    // calculate the area
    let totalAreaSize = 0;
    layers.map(layer => {
      layer.areas.map(area => {

        let polygon = area.vertices.toArray().map(vertexID => {
          let { x, y } = layer.vertices.get(vertexID);
          return [x, y];
        });

        let polygonWithHoles = polygon;

        area.holes.forEach(holeID => {

          let polygonHole = layer.areas.get(holeID).vertices.toArray().map(vertexID => {
            let { x, y } = layer.vertices.get(vertexID);
            return [x, y];
          });

          polygonWithHoles = polygonWithHoles.concat(polygonHole.reverse());
        });

        let center = polylabel([polygonWithHoles], 1.0);
        let areaSize = areapolygon(polygon, false);

        //subtract holes area
        area.holes.forEach(areaID => {
          let hole = layer.areas.get(areaID);
          let holePolygon = hole.vertices.toArray().map(vertexID => {
            let { x, y } = layer.vertices.get(vertexID);
            return [x, y];
          });
          areaSize -= areapolygon(holePolygon, false);
        });

        totalAreaSize = areaSize ? totalAreaSize + areaSize : totalAreaSize;
      });

    });

    this.currentRegions = _.uniqBy(_.map(currentThermalZoneData, item => {
      return {
        regionNum: item.regionNum,
        region: item.region
      }
    }), 'regionNum', 'region');

    this.futureRegions = _.uniqBy(_.map(futureThermalZoneData, item => {
      return {
        regionNum: item.regionNum,
        region: item.region
      }
    }), 'regionNum', 'region');

    this.state = {
      dataWidth: scene.width,
      dataHeight: scene.height,
      dataDefaultWallHeight: scene.defaultWallHeight || 300,
      dataDefaultWallWidth: scene.defaultWallWidth || 20,
      thermalRegulation: scene.thermalRegulation || CURRENT_THERMAL_REGULATION,
      typeOfGrouping: scene.typeOfGrouping || ISOLATE_BUILDING,
      numberOfFloor: scene.numberOfFloor || 1,
      firstFloorType: scene.firstFloorType || VENTILATED,
      totalAreaSize: totalAreaSize || 0,
      region: scene.region || 15,
      commune: scene.commune || 'Arica'
    };


  }

  onSubmit(event) {
    event.preventDefault();

    let { projectActions } = this.context;

    let {
      dataWidth, dataHeight, dataDefaultWallWidth, dataDefaultWallHeight,
      thermalRegulation, typeOfGrouping, numberOfFloor, firstFloorType,
      region, commune
    } = this.state;
    dataHeight = _.isNumber(parseInt(dataHeight)) ? parseInt(dataHeight) : 2000;
    dataWidth = _.isNumber(parseInt(dataWidth)) ? parseInt(dataWidth) : 3000;
    dataDefaultWallWidth = _.isNumber(parseInt(dataDefaultWallWidth)) ? parseInt(dataDefaultWallWidth) : 20;
    dataDefaultWallHeight = _.isNumber(parseInt(dataDefaultWallHeight)) ? parseInt(dataDefaultWallHeight) : 300;

    let selectedCommune = _.find(currentThermalZoneData, { regionNum: region, commune: commune })
    if (thermalRegulation === FUTURE_THERMAL_REGULATION) {
      selectedCommune = _.find(futureThermalZoneData, { regionNum: region, commune: commune })
    }

    if (dataWidth <= 100 || dataHeight <= 100) {
      alert('Scene size too small');
    } else {
      projectActions.setProjectProperties({
        width: dataWidth,
        height: dataHeight,
        defaultWallWidth: dataDefaultWallWidth,
        defaultWallHeight: dataDefaultWallHeight,
        thermalRegulation: thermalRegulation,
        typeOfGrouping: typeOfGrouping,
        numberOfFloor: numberOfFloor,
        firstFloorType: firstFloorType,
        region: region,
        commune: commune,
        thermalZone: selectedCommune ? selectedCommune.thermalZone : 1
      });
    }
  }

  onThermalRegulationChanged(newRegulation) {
    this.setState({ thermalRegulation: newRegulation })
  }

  onRegionChanged(newRegion) {
    this.setState({ region: newRegion });
  }

  onCommuneChanged(newCommune) {
    this.setState({ commune: newCommune });
  }

  render() {
    let { width, height } = this.props;
    let {
      dataWidth, dataHeight, dataDefaultWallHeight, dataDefaultWallWidth,
      thermalRegulation, typeOfGrouping, numberOfFloor, firstFloorType, totalAreaSize,
      region, commune
    } = this.state;
    let { projectActions, translator } = this.context;

    let thermalRegulations = THERMAL_REGULATION.map(item => {
      return {
        value: item,
        text: translator.t(item)
      };
    });

    let typeOfGroupings = TYPE_OF_GROUPING.map(item => {
      return {
        value: item,
        text: translator.t(item)
      };
    });

    let firstFloorTypes = FIRST_FLOOR_TYPE.map(item => {
      return {
        value: item,
        text: translator.t(item)
      };
    });

    let regions = thermalRegulation === FUTURE_THERMAL_REGULATION ? this.futureRegions : this.currentRegions;

    let communes = [];
    if (thermalRegulation === FUTURE_THERMAL_REGULATION) {
      communes = _.filter(futureThermalZoneData, item => {
        return item.regionNum == region
      });
    } else {
      communes = _.filter(currentThermalZoneData, item => {
        return item.regionNum == region
      });
    }

    return (
      <ContentContainer width={width} height={height}>
        <ContentTitle>{translator.t('Project config')}</ContentTitle>

        <form onSubmit={e => this.onSubmit(e)}>
          <FormBlock>
            <FormLabel htmlFor='height'>{translator.t('Canvas Width')}</FormLabel>
            <FormTextInput
              id='width'
              placeholder='width'
              value={dataWidth}
              onChange={e => this.setState({ dataWidth: e.target.value })}
            />
          </FormBlock>

          <FormBlock>
            <FormLabel htmlFor='height'>{translator.t('Canvas Height')}</FormLabel>
            <FormTextInput
              id='height'
              placeholder='height'
              value={dataHeight}
              onChange={e => this.setState({ dataHeight: e.target.value })}
            />
          </FormBlock>

          <FormBlock>
            <FormLabel htmlFor='default-wall-height'>{translator.t('Default Wall Height')}</FormLabel>
            <FormTextInput
              id='default-wall-height'
              placeholder='default-wall-height'
              value={dataDefaultWallHeight}
              onChange={e => this.setState({ dataDefaultWallHeight: e.target.value })}
            />
          </FormBlock>

          <FormBlock>
            <FormLabel htmlFor='thermal-regulations'>{translator.t('Thermal Regulations')}</FormLabel>
            <FormSelect id="thermal-regulations"
              value={thermalRegulation}
              onChange={e => this.onThermalRegulationChanged(e.target.value)}
            >
              {
                thermalRegulations.map(el => <option key={el.value} value={el.value}>{el.text}</option>)
              }

            </FormSelect>
          </FormBlock>

          <FormBlock>
            <FormLabel htmlFor='region'>{translator.t('Region')}</FormLabel>
            <FormSelect id="region"
              value={region}
              onChange={e => this.onRegionChanged(e.target.value)}
            >
              {
                regions.map(el => <option key={el.regionNum} value={el.regionNum}>{el.region}</option>)
              }

            </FormSelect>
          </FormBlock>

          <FormBlock>
            <FormLabel htmlFor='commune'>{translator.t('Commune')}</FormLabel>
            <FormSelect id="commune"
              value={commune}
              onChange={e => this.onCommuneChanged(e.target.value)}
            >
              {
                communes.map(el => <option key={el.commune} value={el.commune}>{el.commune}</option>)
              }

            </FormSelect>
          </FormBlock>

          <FormBlock>
            <FormLabel htmlFor='type-of-grouping'>{translator.t('Type of grouping')}</FormLabel>
            <FormSelect id="type-of-grouping"
              value={typeOfGrouping}
              onChange={e => this.setState({ typeOfGrouping: e.target.value })}
            >
              {
                typeOfGroupings.map(el => <option key={el.value} value={el.value}>{el.text}</option>)
              }
            </FormSelect>
          </FormBlock>

          <FormBlock>
            <FormLabel htmlFor='number-of-floors'>{translator.t('Number of floors')}</FormLabel>
            <FormSelect id="number-of-floors"
              value={numberOfFloor}
              onChange={e => this.setState({ numberOfFloor: e.target.value })}
            >
              {
                NUMBER_OF_FLOORS.map(el => <option key={el} value={el}>{el}</option>)
              }
            </FormSelect>
          </FormBlock>

          <FormBlock>
            <FormLabel htmlFor='area'>{translator.t('Number of square meters of the building')}</FormLabel>
            <FormTextInput
              id='area'
              value={(totalAreaSize / 10000).toFixed(2)}
              style={{ disabled: 'disabled' }}
              onChange={e => { }}
            />
          </FormBlock>

          <FormBlock>
            <FormLabel htmlFor='first-floor-type'>{translator.t('First floor type')}</FormLabel>
            <FormSelect id="first-floor-type"
              value={firstFloorType}
              onChange={e => this.setState({ firstFloorType: e.target.value })}
            >
              {
                firstFloorTypes.map(el => <option key={el.value} value={el.value}>{el.text}</option>)
              }
            </FormSelect>
          </FormBlock>

          <table style={{ float: 'right' }}>
            <tbody>
              <tr>
                <td>
                  <CancelButton size='large'
                    onClick={e => projectActions.rollback()}>{translator.t('Cancel')}</CancelButton>
                </td>
                <td>
                  <FormSubmitButton size='large'>{translator.t('Save')}</FormSubmitButton>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </ContentContainer>
    )
  }
}

ProjectConfigurator.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  state: PropTypes.object.isRequired,
};

ProjectConfigurator.contextTypes = {
  projectActions: PropTypes.object.isRequired,
  translator: PropTypes.object.isRequired,
};
