import React, { Fragment } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import {
  Button, Label, ModalHeader, ModalBody, ModalFooter,
  FormGroup
} from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import IntlMessages from "../../helpers/IntlMessages";
import reduxDialog from '../../components/common/modal/redux-reactstrap-modal';
import * as projectActionsAll from '../../redux/projects/actions';
import { Project } from '../../react-planner/class/export';
import saveSVGScreenshotToFile from "../../helpers/Screenshot";


const SaveAsProjectModal = ({ toggle, planner, projectActions }) => {

  const history = useHistory();

  const onSubmit = (values) => {
    const statePlanner = planner.get('react-planner');
    const { updatedState } = Project.unselectAll(statePlanner);
    const projectState = updatedState.get('scene').toJS();

    // TODO: logic nested dialog to check the name is existed
    // let result = await confirm();

    const addRemoteProjectCallback = (imageBlob) => {
      projectActions.addRemoteProject(values.name, projectState, imageBlob, history);
      toggle();
    };

    saveSVGScreenshotToFile(addRemoteProjectCallback);
  };

  const validateName = (value) => {
    let error;
    if (!value) {
      error = 'Please enter project name';
    } else if (value.length < 2) {
      error = 'Value must be longer than 2 characters';
    }
    return error;
  };

  return (
    <Fragment key="new-project-modal">
      <ModalHeader toggle={toggle}>
        <IntlMessages id="planner.save-project-as" />
      </ModalHeader>
      <Formik
        initialValues={{
          name: '',
        }}
        onSubmit={onSubmit}
      >
        {({ errors, touched }) => (
          <Form className="av-tooltip tooltip-label-right">
            <ModalBody>
              <FormGroup>
                <Label><IntlMessages id="planner.project-name" /></Label>
                <Field
                  className="form-control"
                  name="name"
                  validate={validateName}
                />
                {errors.name && touched.name && (
                  <div className="invalid-feedback d-block">
                    {errors.name}
                  </div>
                )}
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit"><IntlMessages id="planner.modal.submit" /></Button>{' '}
              <Button color="secondary" onClick={toggle}><IntlMessages id="planner.modal.cancel" /></Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Fragment>
  )
}

const mapStateToProps = ({ planner }) => {
  return {
    planner
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    projectActions: bindActionCreators(projectActionsAll, dispatch)
  };
};

export default reduxDialog(connect, {
  name: 'saveAsProjectDialog'
})(connect(mapStateToProps, mapDispatchToProps)(SaveAsProjectModal));