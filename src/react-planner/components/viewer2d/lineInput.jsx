import React, { useState } from "react";
import PropTypes from 'prop-types';
import * as SharedStyle from '../../shared-style';

const STYLE_EDITABLE = {
  position: 'absolute',
  pointerEvents: 'none',
  backgroundColor: SharedStyle.COLORS.white,
  boxShadow: 'rgb(6, 150, 215) 0px 4px 0px 1px',
  display: 'inline-flex',
  height: '1.5rem',
  minWidth: '10px',
  outline: 'rgb(6, 150, 215) solid 1px',
  padding: '3px 0.25rem'
}

const STYLE_INPUT = {
  boxSizing: 'content-box',
  width: '60px'
};

export default function LineInput(props) {

  const [focus, setFocus] = useState(false);
  const [valid, setValid] = useState(true);

  return (
    <div className="dynamic-input-editable" style={STYLE_EDITABLE}>
      <div className="line-input-container">
        <input className="dynamic-input-editable-input" style={STYLE_INPUT} defaultValue='100' type='text' />
      </div>
    </div>
  );
}

LineInput.propTypes = {
  //value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  //style: PropTypes.object,
  //onValid: PropTypes.func,
  //onInvalid: PropTypes.func,
  //onSubmit: PropTypes.func
}
