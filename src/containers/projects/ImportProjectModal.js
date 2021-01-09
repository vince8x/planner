import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Button,
  Label,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
} from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import IntlMessages from '../../helpers/IntlMessages';
import reduxDialog from '../../components/common/modal/redux-reactstrap-modal';
import * as projectActionsAll from '../../redux/projects/actions';

const ImportProjectModal = ({ toggle, projectActions }) => {

  const onSubmit = (values) => {
    projectActions.loadRemoteProjectData(values.userId, values.projectId);
    toggle();
  };

  const validateProjectId = (value) => {
    let error;
    if (!value) {
      error = 'Please enter project id';
    }
    return error;
  };

  const validateUserId = (value) => {
    let error;
    if (!value) {
      error = 'Please enter user id';
    }
    return error;
  };

  return (
    <Fragment key="debug-project-modal">
      <ModalHeader toggle={toggle}>
        <IntlMessages id="planner.debug-project-export-json" />
      </ModalHeader>
      <Formik
        initialValues={{
          userId: '',
          projectId: '',
        }}
        onSubmit={onSubmit}
      >
        {({ errors, touched }) => (
          <Form className="av-tooltip tooltip-label-right">
            <ModalBody>
              <FormGroup>
                <Label>
                  <IntlMessages id="planner.user-id" />
                </Label>
                <Field
                  className="form-control"
                  name="userId"
                  validate={validateUserId}
                />
                {errors.userId && touched.userId && (
                  <div className="invalid-feedback d-block">{errors.userId}</div>
                )}
                <br/>
                <Label>
                  <IntlMessages id="planner.project-id" />
                </Label>
                <Field
                  className="form-control"
                  name="projectId"
                  validate={validateProjectId}
                />
                {errors.projectId && touched.projectId && (
                  <div className="invalid-feedback d-block">{errors.projectId}</div>
                )}
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit">
                <IntlMessages id="planner.modal.submit" />
              </Button>{' '}
              <Button color="secondary" onClick={toggle}>
                <IntlMessages id="planner.modal.cancel" />
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    projectActions: bindActionCreators(projectActionsAll, dispatch),
  };
};

export default reduxDialog(connect, {
  name: 'importProjectDialog',
})(connect(null, mapDispatchToProps)(ImportProjectModal));
