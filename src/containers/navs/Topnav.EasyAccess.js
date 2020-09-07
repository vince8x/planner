import React from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import IntlMessages from '../../helpers/IntlMessages';

const TopnavEasyAccess = () => {
  return (
    <div className="position-relative d-none d-sm-inline-block">
      <UncontrolledDropdown className="dropdown-menu-right">
        <DropdownToggle className="header-icon" color="empty">
          <i className="simple-icon-grid" />
        </DropdownToggle>
        <DropdownMenu
          className="position-absolute mt-3 planner"
          right
          id="iconMenuDropdown"
        >
          <NavLink to="/" className="icon-menu-item">
            <i className="simple-icon-home d-block" />{' '}
            <IntlMessages id="menu.home" />
          </NavLink>
          <NavLink to="/projects" className="icon-menu-item">
            <i className="iconsminds-library d-block" />{' '}
            <IntlMessages id="menu.projects" />
          </NavLink>
          <NavLink to="/user/register" className="icon-menu-item">
            <i className="simple-icon-user-follow d-block" />{' '}
            <IntlMessages id="menu.register" />
          </NavLink>
          <NavLink to="/user/login" className="icon-menu-item">
            <i className="simple-icon-login d-block" />{' '}
            <IntlMessages id="menu.login" />
          </NavLink>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
};

export default TopnavEasyAccess;
