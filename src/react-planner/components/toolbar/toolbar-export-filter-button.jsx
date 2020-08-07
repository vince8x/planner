import React from 'react';
import PropTypes from 'prop-types';
import polylabel from 'polylabel';
import areapolygon from 'area-polygon';
import { FaFileExport as IconExport } from 'react-icons/fa';
import * as _ from 'lodash';
import ToolbarButton from './toolbar-button';
import { csvDownload } from '../../utils/browser';
import { Project } from '../../class/export';
import { THERMAL_REQUIREMENTS, ACOUSTIC_REQUIREMENTS, FIRE_RESISTANCE_REQUIREMENTS, FUTURE_THERMAL_REGULATION, ISOLATE_BUILDING, HORIZONTAL_PAIRED_BUILDING, COLLECTIVE_BUILDING } from '../../constants';
import { futureThermalRequirements } from './../../data/thermal-regulations/future';
import { currentThermalRequirements, pdaData } from './../../data/thermal-regulations/current';
import { fireResistanceSmall, fireResistanceBig } from './../../data/fire-resistance/fire-resistance';
import { exportRequirement } from '../../utils/csv-export';

export default function ToolbarExportFilterButton({ state, type }, { translator }) {

  const translateType = translator.t(type);

  let saveProjectRequirementsToFile = e => {
    e.preventDefault();
    state = Project.unselectAll(state).updatedState;
    const scene = state.get('scene').toJS();
    
    exportRequirement(scene, type, translateType);
  };

  return (
    <ToolbarButton active={false} tooltip={translateType} onClick={saveProjectRequirementsToFile}>
      <IconExport />
    </ToolbarButton>
  );
}

ToolbarExportFilterButton.propTypes = {
  state: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired
};

ToolbarExportFilterButton.contextTypes = {
  translator: PropTypes.object.isRequired,
};
