import React from 'react';
import ContainerDimensions from 'react-container-dimensions';

import {
  ReactPlanner,
  Plugins as PlannerPlugins,
} from '../../react-planner';

import MyCatalog from '../../catalog/mycatalog';
import ToolbarScreenshotButton from '../../ui/toolbar-screenshot-button';

const toolbarButtons = [
  ToolbarScreenshotButton,
];

const PlannerPage = () => {

  const plugins = [
    PlannerPlugins.Keyboard(),
    PlannerPlugins.Autosave('react-planner_v0'),
    PlannerPlugins.ConsoleDebugger(),
  ];

  return (
    <ContainerDimensions>
      {({ width, height }) =>
        <ReactPlanner
          catalog={MyCatalog}
          width={width}
          height={height}
          plugins={plugins}
          toolbarButtons={toolbarButtons}
          stateExtractor={state => {
            return state.get('react-planner');
          }}
        />
      }
      
    </ContainerDimensions>

  );
}

export default PlannerPage;