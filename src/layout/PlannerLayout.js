/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import convert from 'convert-units';
import { Map } from 'immutable';
import classNames from 'classnames/bind';
import { ToastContainer } from 'react-toastify-redux';
import 'react-toastify/dist/ReactToastify.css';
// import 'react-progress-bar-plus/lib/progress-bar.css';
import TopnavPlanner from '../containers/navs/TopnavPlanner';
import LengthInputModal from '../components/common/modal/LengthInputModal';
import { GeometryUtils } from '../react-planner/utils/export';
import { UNIT_CENTIMETER } from '../react-planner/constants';
import { objectsMap } from '../react-planner/utils/objects-utils';
import actions from '../react-planner/actions/export';
import SaveAsProjectModal from '../containers/projects/SaveAsProjectModal';
import ExportSolutionsModal from '../containers/projects/ExportSolutionsModal';
import OptimizationSidebar from '../react-planner/components/optimization-sidebar/optimization-sidebar';
// import Sidebar from '../containers/navs/Sidebar';

const PlannerLayout = ({
  containerClassnames,
  showOptimizationBar,
  children,
  history,
  statePlanner,
  projectActions,
}) => {
  const handleLengthInput = (length, unit) => {
    const state = statePlanner.get('react-planner');
    const { scene, drawingSupport } = state;

    if (
      scene &&
      drawingSupport &&
      !scene.isEmpty() &&
      !drawingSupport.isEmpty()
    ) {
      // Construct the formAttribute
      const layerID = drawingSupport.get('layerID');
      const lineID = drawingSupport.get('lineID');
      const layer = scene.getIn(['layers', layerID]);
      const element = scene.getIn(['layers', layerID, 'lines', lineID]);

      const value = new Map({
        length,
        _length: length,
        _unit: unit,
      });

      if (layer && element) {
        const v_0 = layer.vertices.get(element.vertices.get(0));
        const v_1 = layer.vertices.get(element.vertices.get(1));

        let v_a = v_0;
        let v_b = v_1;

        const distance = GeometryUtils.pointsDistance(
          v_a.x,
          v_a.y,
          v_b.x,
          v_b.y
        );
        const _unit = element.misc.get('_unitLength') || UNIT_CENTIMETER;
        const _length = convert(distance).from(UNIT_CENTIMETER).to(_unit);

        let attributesFormData = new Map({
          vertexOne: v_0,
          vertexTwo: v_1,
          lineLength: new Map({ length: distance, _length, _unit }),
        });

        const v_b_new = GeometryUtils.extendLine(
          v_a.x,
          v_a.y,
          v_b.x,
          v_b.y,
          value.get('length'),
          2
        );

        attributesFormData = attributesFormData.withMutations((attr) => {
          attr.set('vertexTwo', v_b.merge(v_b_new));
          attr.set('lineLength', value);
        });

        projectActions.setLinesLengthEndDrawing(attributesFormData, layerID);
      }
    }
  };

  return (
    <div id="planner-container" className={classNames({
      containerClassnames,
      'bar-show': showOptimizationBar
      })}>
      <TopnavPlanner history={history} />
      <OptimizationSidebar showOptimizationBar={showOptimizationBar}/>
      <main>
        <div className="container-fluid">{children}</div>
      </main>
      <LengthInputModal
        autoFocus={false}
        onSubmitLength={(length, unit) => handleLengthInput(length, unit)}
      />
      <SaveAsProjectModal autoFocus={false} />
      <ExportSolutionsModal autoFocus={false} />
      <ToastContainer />
    </div>
  );
};
const mapStateToProps = ({ menu, planner }) => {
  const { containerClassnames, showOptimizationBar } = menu;
  return {
    containerClassnames,
    showOptimizationBar,
    statePlanner: planner,
  };
};

const mapActionToProps = (dispatch) => {
  return {
    ...objectsMap(actions, (actionNamespace) =>
      bindActionCreators(actions[actionNamespace], dispatch)
    ),
  };
};

export default withRouter(
  connect(mapStateToProps, mapActionToProps)(PlannerLayout)
);
