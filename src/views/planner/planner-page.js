import React, { useEffect } from 'react';
import ContainerDimensions from 'react-container-dimensions';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { ReactPlanner, Plugins as PlannerPlugins } from '../../react-planner';
import MyCatalog from '../../catalog/mycatalog';
import ToolbarScreenshotButton from '../../ui/toolbar-screenshot-button';
import * as projectActionsAll from '../../redux/projects/actions';

const toolbarButtons = [ToolbarScreenshotButton];

const PlannerPage = ({ projects, loadRemoteProject }) => {
  const plugins = [
    PlannerPlugins.Keyboard(),
    PlannerPlugins.Autosave('react-planner_v0'),
    PlannerPlugins.ConsoleDebugger(),
  ];

  const history = useHistory();

  const { id } = useParams();

  useEffect(() => {
    if (id) {
        loadRemoteProject(id, history);
      } else {
        plugins.push(PlannerPlugins.Autoload('react-planner_v0'));
      }
  }, []);

  return (
    <ContainerDimensions>
      {({ width, height }) => (
        <ReactPlanner
          catalog={MyCatalog}
          width={width}
          height={height}
          plugins={plugins}
          toolbarButtons={toolbarButtons}
          stateExtractor={(state) => {
            return state.get('react-planner');
          }}
        />
      )}
    </ContainerDimensions>
  );
};

const mapStateToProps = ({ projects }) => {
  return { projects };
};

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(projectActionsAll, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlannerPage);
