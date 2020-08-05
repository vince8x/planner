import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  ButtonDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Button
} from "reactstrap";
import IntlMessages from '../../helpers/IntlMessages';

const SplitButton = (props) => {

  const { id, title } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span id={`splitbutton_${id}`}>
      <ButtonDropdown isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
        <Button id="caret" color="secondary"><IntlMessages id={title} /></Button>
        <DropdownToggle caret color="secondary" />
        <DropdownMenu>
          {props.childItems.map((item, index) => {
            return (
              <DropdownItem key={`splitbutton_${item.id}_${index}`}>
                <IntlMessages id={item.title} />
              </DropdownItem>)
          })}
        </DropdownMenu>
      </ButtonDropdown>
    </span>
  );
}

SplitButton.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  //   shortTitle: PropTypes.string,
  //   icon: PropTypes.string,
  //   activeChildIndex: PropTypes.number,
    childItems: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
  //     shortTitle: PropTypes.string,
  //     icon: PropTypes.string,
  //     active: PropTypes.bool,
    }))
};

export default SplitButton;