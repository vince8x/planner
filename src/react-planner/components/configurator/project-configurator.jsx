import React, { Component } from 'react';
import PropTypes from 'prop-types';
import areapolygon from 'area-polygon';
import * as _ from 'lodash';
import {
  ContentTitle,
  ContentContainer,
  FormLabel,
  FormBlock,
  FormSelect,
  FormSubmitButton,
  CancelButton,
  FormTextInput
} from '../style/export';
import { THERMAL_REGULATION, CURRENT_THERMAL_REGULATION, VENTILATED } from '../../constants';
import { TYPE_OF_GROUPING, NUMBER_OF_FLOORS, FIRST_FLOOR_TYPE, ISOLATE_BUILDING, FUTURE_THERMAL_REGULATION } from './../../constants';
import { futureThermalZoneData } from '../../data/thermal-regulations/future';
import { currentThermalZoneData } from '../../data/thermal-regulations/current';
import IntlMessages from '../../../helpers/IntlMessages';

export default class ProjectConfigurator extends Component {

  constructor(props, context) {
    super(props, context);

    const { scene } = props.state;
    const layers = scene.get('layers');

    // calculate the area
    let totalAreaSize = 0;
    layers.map(layer => {
      layer.areas.map(area => {

        const polygon = area.vertices.toArray().map(vertexID => {
          const { x, y } = layer.vertices.get(vertexID);
          return [x, y];
        });

        let polygonWithHoles = polygon;

        area.holes.forEach(holeID => {

          const polygonHole = layer.areas.get(holeID).vertices.toArray().map(vertexID => {
            const { x, y } = layer.vertices.get(vertexID);
            return [x, y];
          });

          polygonWithHoles = polygonWithHoles.concat(polygonHole.reverse());
        });

        let areaSize = areapolygon(polygon, false);

        // subtract holes area
        area.holes.forEach(areaID => {
          const hole = layer.areas.get(areaID);
          const holePolygon = hole.vertices.toArray().map(vertexID => {
            const { x, y } = layer.vertices.get(vertexID);
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
      thermalRegulation: scene.thermalRegulation || CURRENT_THERMAL_REGULATION,
      typeOfGrouping: scene.typeOfGrouping || ISOLATE_BUILDING,
      numberOfFloor: scene.numberOfFloor || 1,
      firstFloorType: scene.firstFloorType || VENTILATED,
      totalAreaSize: totalAreaSize || 0,
      regionNum: scene.regionNum || 15,
      commune: scene.commune || 'Arica'
    };


  }

  onSubmit(event) {
    event.preventDefault();

    const { projectActions } = this.context;

    const {
      thermalRegulation, typeOfGrouping, numberOfFloor, firstFloorType,
      regionNum, commune
    } = this.state;
    let selectedCommune = _.find(currentThermalZoneData, { regionNum, commune })
    if (thermalRegulation === FUTURE_THERMAL_REGULATION) {
      selectedCommune = _.find(futureThermalZoneData, { regionNum, commune })
    }

    projectActions.setProjectProperties({
      thermalRegulation,
      typeOfGrouping,
      numberOfFloor,
      firstFloorType,
      regionNum,
      commune,
      thermalZone: selectedCommune ? selectedCommune.thermalZone : 1
    });
  }

  onThermalRegulationChanged(newRegulation) {
    this.setState({ thermalRegulation: newRegulation })
  }

  onRegionChanged(newRegion) {
    this.setState({ regionNum: newRegion });
  }

  onCommuneChanged(newCommune) {
    this.setState({ commune: newCommune });
  }

  render() {
    const { width, height } = this.props;
    const {
      thermalRegulation, typeOfGrouping, numberOfFloor, firstFloorType, totalAreaSize,
      regionNum, commune
    } = this.state;
    const numberOfSquareMeters = numberOfFloor * totalAreaSize;
    const { projectActions, translator } = this.context;

    const thermalRegulations = THERMAL_REGULATION.map(item => {
      return {
        value: item,
        text: translator.t(item)
      };
    });

    const typeOfGroupings = TYPE_OF_GROUPING.map(item => {
      return {
        value: item,
        text: translator.t(item)
      };
    });

    const firstFloorTypes = FIRST_FLOOR_TYPE.map(item => {
      return {
        value: item,
        text: translator.t(item)
      };
    });

    const regions = thermalRegulation === FUTURE_THERMAL_REGULATION ? this.futureRegions : this.currentRegions;

    let communes = [];
    if (thermalRegulation === FUTURE_THERMAL_REGULATION) {
      communes = _.filter(futureThermalZoneData, item => {
        return item.regionNum == _.parseInt(regionNum)
      });
    } else {
      communes = _.filter(currentThermalZoneData, item => {
        return item.regionNum == _.parseInt(regionNum)
      });
    }

    return (
      <ContentContainer width={width} height={height}>
        <ContentTitle><IntlMessages id='planner.project-config' /></ContentTitle>

        <form onSubmit={e => this.onSubmit(e)}>
          <FormBlock>
            <FormLabel htmlFor='thermal-regulations'>
              <IntlMessages id='planner.thermal-regulations' />
            </FormLabel>
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
            <FormLabel htmlFor='planner.region'>
              <IntlMessages id='planner.region' />
            </FormLabel>
            <FormSelect id="region"
              value={regionNum}
              onChange={e => this.onRegionChanged(e.target.value)}
            >
              {
                regions.map(el => <option key={el.regionNum} value={el.regionNum}>{el.region}</option>)
              }

            </FormSelect>
          </FormBlock>

          <FormBlock>
            <FormLabel htmlFor='commune'>
              <IntlMessages id='planner.commune' />
            </FormLabel>
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
            <FormLabel htmlFor='type-of-grouping'>
              <IntlMessages id='planner.type-of-grouping' />
            </FormLabel>
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
            <FormLabel htmlFor='number-of-floors'>
              <IntlMessages id='planner.number-of-floors' />
            </FormLabel>
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
            <FormLabel htmlFor='area'>
              <IntlMessages id='planner.number-of-square-meters-of-the-building' />
            </FormLabel>
            <FormTextInput
              id='area'
              value={(numberOfSquareMeters / 10000).toFixed(2)}
              style={{ disabled: 'disabled' }}
              onChange={e => { }}
            />
          </FormBlock>

          <FormBlock>
            <FormLabel htmlFor='first-floor-type'>
              <IntlMessages id='planner.first-floor-type' />
            </FormLabel>
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

ProjectConfigurator.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  state: PropTypes.object.isRequired,
};

ProjectConfigurator.contextTypes = {
  projectActions: PropTypes.object.isRequired,
  translator: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired
};
