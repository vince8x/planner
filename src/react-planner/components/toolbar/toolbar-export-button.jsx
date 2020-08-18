import React from 'react';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import {FaFileExport as IconExport} from 'react-icons/fa';
import ToolbarButton from './toolbar-button';
import { Project } from '../../class/export';
import { exportElementsCsv } from '../../utils/csv-export';

export default function ToolbarExportButton({state}, {translator, intl}) {

  let saveProjectElementsToFile = e => {
    e.preventDefault();
    state = Project.unselectAll( state ).updatedState;
    const scene = state.get('scene').toJS();
    exportElementsCsv(scene);
  };

  return (
    <ToolbarButton active={false} tooltip={intl.formatMessage({ id: 'planner.export-project' })} onClick={saveProjectElementsToFile}>
      <IconExport />
    </ToolbarButton>
  );
}

ToolbarExportButton.propTypes = {
  state: PropTypes.object.isRequired,
};

ToolbarExportButton.contextTypes = {
  translator: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
};
