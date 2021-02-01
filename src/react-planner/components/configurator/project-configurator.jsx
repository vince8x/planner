import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import areapolygon from 'area-polygon';
import * as _ from 'lodash';
import * as plannerActionsAll from '../../../redux/planner/actions';

import {
  ContentTitle,
  ContentContainer,
  FormLabel,
  FormBlock,
  FormSelect,
  FormSubmitButton,
  CancelButton,
  FormTextInput,
} from '../style/export';
import {
  THERMAL_REGULATION,
  CURRENT_THERMAL_REGULATION,
  VENTILATED,
  SEISMIC_ZONE,
} from '../../constants';
import {
  TYPE_OF_GROUPING,
  NUMBER_OF_FLOORS,
  SOIL_TYPES,
  FIRST_FLOOR_TYPE,
  ISOLATE_BUILDING,
  SEISMIC_ZONES,
  FUTURE_THERMAL_REGULATION,
  BUILDING_TYPES,
} from './../../constants';
import { futureThermalZoneData } from '../../data/thermal-regulations/future';
import { currentThermalZoneData } from '../../data/thermal-regulations/current';
import IntlMessages from '../../../helpers/IntlMessages';
import calculateArea from '../../utils/calculation';

class ProjectConfigurator extends Component {
  constructor(props, context) {
    super(props, context);

    const { scene } = props.state;
    const layers = scene.get('layers');

    // calculate the area
    let totalAreaSize = 0;
    layers.map((layer) => {
      layer.areas.map((area) => {
        totalAreaSize = calculateArea(area, layer);
      });
    });

    this.currentRegions = _.uniqBy(
      _.map(currentThermalZoneData, (item) => {
        return {
          regionNum: item.regionNum,
          region: item.region,
        };
      }),
      'regionNum',
      'region'
    );

    this.futureRegions = _.uniqBy(
      _.map(futureThermalZoneData, (item) => {
        return {
          regionNum: item.regionNum,
          region: item.region,
        };
      }),
      'regionNum',
      'region'
    );

    this.state = {
      thermalRegulation: scene.thermalRegulation || CURRENT_THERMAL_REGULATION,
      typeOfGrouping: scene.typeOfGrouping || ISOLATE_BUILDING,
      numberOfFloor: scene.numberOfFloor || 1,
      soilType: scene.soilType || 'A',
      buildingType: scene.buildingType || 1,
      seismicZone: scene.seismicZone || 1,
      firstFloorType: scene.firstFloorType || VENTILATED,
      totalAreaSize: totalAreaSize || 0,
      regionNum: scene.regionNum || 15,
      commune: scene.commune || 'Arica',
      dataDefaultWallHeight: scene.defaultWallHeight || 230,
    };
  }

  onSubmit(event) {
    event.preventDefault();

    const { projectActions } = this.context;

    const {
      thermalRegulation,
      typeOfGrouping,
      numberOfFloor,
      soilType,
      seismicZone,
      buildingType,
      firstFloorType,
      regionNum,
      commune,
    } = this.state;
    
    let {
      dataDefaultWallHeight
    } = this.state;
    
    const numberOfFloorInt = _.parseInt(numberOfFloor);
    const buildingTypeInt = _.parseInt(buildingType);
    const seismicZoneInt = _.parseInt(seismicZone);
    const regionNumInt = _.parseInt(regionNum);
    let selectedCommune = _.find(currentThermalZoneData, {
      regionNum: regionNumInt,
      commune: commune,
    });
    if (thermalRegulation === FUTURE_THERMAL_REGULATION) {
      selectedCommune = _.find(futureThermalZoneData, {
        regionNum: regionNumInt,
        commune: commune,
      });
    }

    dataDefaultWallHeight = _.isNumber(parseInt(dataDefaultWallHeight))
      ? parseInt(dataDefaultWallHeight)
      : 230;

    if (dataDefaultWallHeight > 244 || dataDefaultWallHeight < 230) {
      return this.props.plannerActions.setHeightFailure();
    }
    
    projectActions.setProjectProperties({
      thermalRegulation,
      typeOfGrouping,
      soilType,
      numberOfFloor: numberOfFloorInt,
      seismicZone: seismicZoneInt,
      buildingType: buildingTypeInt,
      firstFloorType,
      regionNum,
      commune,
      thermalZone: selectedCommune ? selectedCommune.thermalZone : 1,
      defaultWallHeight: dataDefaultWallHeight,
    });
  }

  onThermalRegulationChanged(newRegulation) {
    this.setState({ thermalRegulation: newRegulation });
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
      thermalRegulation,
      typeOfGrouping,
      numberOfFloor,
      soilType,
      seismicZone,
      buildingType,
      firstFloorType,
      totalAreaSize,
      regionNum,
      commune, 
      dataDefaultWallHeight,
    } = this.state;
    const numberOfSquareMeters = numberOfFloor * totalAreaSize;
    const { projectActions, translator } = this.context;

    const thermalRegulations = THERMAL_REGULATION.map((item) => {
      return {
        value: item,
        text: translator.t(item),
      };
    });

    const typeOfGroupings = TYPE_OF_GROUPING.map((item) => {
      return {
        value: item,
        text: translator.t(item),
      };
    });

    const firstFloorTypes = FIRST_FLOOR_TYPE.map((item) => {
      return {
        value: item,
        text: translator.t(item),
      };
    });

    const regions =
      thermalRegulation === FUTURE_THERMAL_REGULATION
        ? this.futureRegions
        : this.currentRegions;

    let communes = [];
    if (thermalRegulation === FUTURE_THERMAL_REGULATION) {
      communes = _.filter(futureThermalZoneData, (item) => {
        return item.regionNum === _.parseInt(regionNum);
      });
    } else {
      communes = _.filter(currentThermalZoneData, (item) => {
        return item.regionNum === _.parseInt(regionNum);
      });
    }

    return (
      <ContentContainer width={width} height={height}>
        <ContentTitle>
          <IntlMessages id="planner.project-config" />
        </ContentTitle>

        <form onSubmit={(e) => this.onSubmit(e)}>
          <FormBlock>
            <FormLabel htmlFor="thermal-regulations">
              <IntlMessages id="planner.thermal-regulations" />
            </FormLabel>
            <FormSelect
              id="thermal-regulations"
              value={thermalRegulation}
              onChange={(e) => this.onThermalRegulationChanged(e.target.value)}
            >
              {thermalRegulations.map((el) => (
                <option key={el.value} value={el.value}>
                  {el.text}
                </option>
              ))}
            </FormSelect>
          </FormBlock>

          <FormBlock>
            <FormLabel htmlFor="planner.region">
              <IntlMessages id="planner.region" />
            </FormLabel>
            <FormSelect
              id="region"
              value={regionNum}
              onChange={(e) => this.onRegionChanged(e.target.value)}
            >
              {regions.map((el) => (
                <option key={el.regionNum} value={el.regionNum}>
                  {el.region}
                </option>
              ))}
            </FormSelect>
          </FormBlock>

          <FormBlock>
            <FormLabel htmlFor="commune">
              <IntlMessages id="planner.commune" />
            </FormLabel>
            <FormSelect
              id="commune"
              value={commune}
              onChange={(e) => this.onCommuneChanged(e.target.value)}
            >
              {communes.map((el) => (
                <option key={el.commune} value={el.commune}>
                  {el.commune}
                </option>
              ))}
            </FormSelect>
          </FormBlock>

          <FormBlock>
            <FormLabel htmlFor="soil-type">
              <IntlMessages id="planner.soil-type" />
            </FormLabel>
            <FormSelect
              id="soil-type"
              value={soilType}
              onChange={(e) => this.setState({ soilType: e.target.value })}
            >
              {SOIL_TYPES.map((el) => (
                <option key={el} value={el}>
                  {el}
                </option>
              ))}
            </FormSelect>
          </FormBlock>

          <FormBlock>
            <FormLabel htmlFor="seismic-zone">
              <IntlMessages id="planner.seismic-zone" />
            </FormLabel>
            <FormSelect
              id="seismic-zone"
              value={seismicZone}
              onChange={(e) => this.setState({ seismicZone: e.target.value })}
            >
              {SEISMIC_ZONES.map((el) => (
                <option key={el} value={el}>
                  {el}
                </option>
              ))}
            </FormSelect>
          </FormBlock>

          <FormBlock>
            <FormLabel htmlFor="type-of-grouping">
              <IntlMessages id="planner.type-of-grouping" />
            </FormLabel>
            <FormSelect
              id="type-of-grouping"
              value={typeOfGrouping}
              onChange={(e) =>
                this.setState({ typeOfGrouping: e.target.value })
              }
            >
              {typeOfGroupings.map((el) => (
                <option key={el.value} value={el.value}>
                  {el.text}
                </option>
              ))}
            </FormSelect>
          </FormBlock>

          <FormBlock>
            <FormLabel htmlFor="number-of-floors">
              <IntlMessages id="planner.number-of-floors" />
            </FormLabel>
            <FormSelect
              id="number-of-floors"
              value={numberOfFloor}
              onChange={(e) => this.setState({ numberOfFloor: e.target.value })}
            >
              {NUMBER_OF_FLOORS.map((el) => (
                <option key={el} value={el}>
                  {el}
                </option>
              ))}
            </FormSelect>
          </FormBlock>

          <FormBlock>
            <FormLabel htmlFor="area">
              <IntlMessages id="planner.number-of-square-meters-of-the-building" />
            </FormLabel>
            <FormTextInput
              id="area"
              value={(numberOfSquareMeters / 10000).toFixed(2)}
              style={{ disabled: 'disabled' }}
              onChange={(e) => {}}
            />
          </FormBlock>

          <FormBlock>
            <FormLabel htmlFor="first-floor-type">
              <IntlMessages id="planner.first-floor-type" />
            </FormLabel>
            <FormSelect
              id="first-floor-type"
              value={firstFloorType}
              onChange={(e) =>
                this.setState({ firstFloorType: e.target.value })
              }
            >
              {firstFloorTypes.map((el) => (
                <option key={el.value} value={el.value}>
                  {el.text}
                </option>
              ))}
            </FormSelect>
          </FormBlock>

          <FormBlock>
            <FormLabel htmlFor='default-wall-height'>
              <IntlMessages id='planner.default-wall-height' />
            </FormLabel>
            <FormTextInput
              id='default-wall-height'
              placeholder='default-wall-height'
              value={dataDefaultWallHeight}
              onChange={e => this.setState({ dataDefaultWallHeight: e.target.value })}
            />
          </FormBlock>

          <table style={{ float: 'right' }}>
            <tbody>
              <tr>
                <td>
                  <CancelButton
                    size="large"
                    onClick={(e) => projectActions.rollback()}
                  >
                    <IntlMessages id="planner.cancel" />
                  </CancelButton>
                </td>
                <td>
                  <FormSubmitButton size="large">
                    <IntlMessages id="planner.save" />
                  </FormSubmitButton>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </ContentContainer>
    );
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
  intl: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    plannerActions: bindActionCreators(plannerActionsAll, dispatch)
  };
};

export default connect(null, mapDispatchToProps)(ProjectConfigurator);