import React, { useState, Fragment } from "react";
import { connect } from "react-redux";
import {
  Button, ModalHeader, ModalBody, ModalFooter,
  Input, FormGroup, Col
} from 'reactstrap';
import reduxDialog from './redux-reactstrap-modal';
import IntlMessages from "../../../helpers/IntlMessages";
import { UNIT_CENTIMETER, UNITS_LENGTH } from "../../../react-planner/constants";

const LengthInputModal = ({ toggle, data, onSubmitLength }) => {

  const [length, setLength] = useState(data.length);
  const [unit, setUnit] = useState(data.unit || UNIT_CENTIMETER);

  const handleSubmitLength = (e) => {
    toggle();
    onSubmitLength(length, unit);
  }

  const handleKeyPress = (target) => {
    if (target.charCode === 13) {
      target.preventDefault();
      toggle();
      onSubmitLength(length, unit);
    }
  }

  return (
    <Fragment key="length-input-modal">
      <ModalHeader toggle={toggle}><IntlMessages id="planner.modal.length-input" /></ModalHeader>
      <ModalBody>
        <FormGroup row>
          <Col sm={8}>
            <Input
              autoFocus
              type="text"
              name="length"
              id="planner-length"
              value={length}
              onKeyPress={handleKeyPress}
              onChange={(e) => {
                e.preventDefault();
                const { value } = e.target;
                const regex = /^[0-9]*\.?[0-9]*$/;;
                if (regex.test(value.toString())) {
                  setLength(value);
                }
              }}
            />
          </Col>
          <Col sm={4}>
            <Input type="select" name="unit" id="planner-length-unit"
              onChange={e => setUnit(e.target.value)}
              value={unit}
              onKeyPress={handleKeyPress}
            >
              {
                UNITS_LENGTH.map(el => <option key={el} value={el}>{el}</option>)
              }
            </Input>
          </Col>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={() => handleSubmitLength()}><IntlMessages id="planner.modal.submit" /></Button>{' '}
        <Button color="secondary" onClick={toggle}><IntlMessages id="planner.modal.cancel" /></Button>
      </ModalFooter>
    </Fragment>
  )
};

export default reduxDialog(connect, {
  name: 'lengthInputDialog'
})(LengthInputModal);