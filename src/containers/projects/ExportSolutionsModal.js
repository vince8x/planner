import React, { useState, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import {
  Button, ModalHeader, ModalBody, ModalFooter,
  Input, FormGroup, Col
} from 'reactstrap';
import IntlMessages from "../../helpers/IntlMessages";
import { SOLUTION_CATEGORIES, CATEGORY_PISO_VENTILADOR } from "../../react-planner/constants";
import reduxDialog from '../../components/common/modal/redux-reactstrap-modal';
import * as plannerActionsAll from '../../redux/planner/actions';

const ExportSolutionsModal = ({ toggle, plannerActions }) => {

  const [category, setCategory] = useState(CATEGORY_PISO_VENTILADOR.ID);

  const handleExportSolution = () => {
    plannerActions.exportSolutions(category);
  }

  return (
    <Fragment key="export-solutions-modal">
      <ModalHeader toggle={toggle}>
        <IntlMessages id="planner.export-solutions" />
      </ModalHeader>
      <ModalBody>
        <FormGroup row>
          <Col>
            <Input type="select" name="category" id="planner-category"
              onChange={e => setCategory(e.target.value)}
              value={category}
            >
              {
                SOLUTION_CATEGORIES.map(el => <option key={el.ID} value={el.ID}>{el.NAME}</option>)
              }
            </Input>
          </Col>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={() => handleExportSolution()} type="submit"><IntlMessages id="planner.export" /></Button>{' '}
        <Button color="secondary" onClick={toggle}><IntlMessages id="planner.modal.cancel" /></Button>
      </ModalFooter>
    </Fragment>
  )
}



const mapDispatchToProps = (dispatch) => {
  return {
    plannerActions: bindActionCreators(plannerActionsAll, dispatch)
  };
};

export default reduxDialog(connect, {
  name: 'exportSolutionsDialog'
})(connect(null, mapDispatchToProps)(ExportSolutionsModal))