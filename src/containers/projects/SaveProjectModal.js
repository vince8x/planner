import React, { useState, Fragment } from "react";
import { connect } from "react-redux";
import {
  Button, Label, Select, ModalHeader, ModalBody, ModalFooter,
  Input, FormGroup, Col
} from 'reactstrap';
import { Formik } from 'formik';
import IntlMessages from "../../helpers/IntlMessages";
import reduxDialog from '../../components/common/modal/redux-reactstrap-modal';


const SaveProjectModal = ({ toggle }) => {

  const [name, setName] = useState('');

  return (
    <Fragment key="new-project-modal">
      {/* <Formik
        initialValues={{
          name: '',
        }}
        onSubmit={onSubmit}
      > */}
        <ModalHeader toggle={toggle}>
          <IntlMessages id="planner.save-project-as" />
        </ModalHeader>
        <ModalBody>
          <Label className="mt-4">
            <IntlMessages id="planner.project-name" />
          </Label>
          <Input value={name} onChange={(e) => setName(e.target.value)}/>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" ><IntlMessages id="planner.modal.submit" /></Button>{' '}
          <Button color="secondary" onClick={toggle}><IntlMessages id="planner.modal.cancel" /></Button>
        </ModalFooter>
      {/* </Formik> */}

    </Fragment>
  )
}

export default reduxDialog(connect, {
  name: 'saveProjectDialog'
})(SaveProjectModal);