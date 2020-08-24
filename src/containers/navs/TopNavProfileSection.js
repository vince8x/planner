import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { injectIntl } from 'react-intl';
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Input,
} from 'reactstrap';
import { withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { auth } from '../../helpers/Firebase';
import IntlMessages from '../../helpers/IntlMessages';
import * as authActionsAll from '../../redux/auth/actions';

const TopNavProfileSection = ({
  intl,
  authUser,
  authActions,
}) => {

  const history = useHistory();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        authActions.loginUserError('');
      } else {
        authActions.loginUserSuccess(user);
      }
    });
  }, [history]);

  const handleLogout = () => {
    authActions.logoutUser(history);
  };

  return (authUser.user &&
    <UncontrolledDropdown className="dropdown-menu-right">
      <DropdownToggle className="p-0" color="empty">
        <span className="name mr-1">{authUser.displayName}</span>
        <span>
          <img alt="Profile" src="/assets/img/profiles/no-avatar.png" />
        </span>
      </DropdownToggle>
      <DropdownMenu className="mt-3" right>
        <DropdownItem onClick={() => handleLogout()}>
          <IntlMessages id='user.signout' />
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
}

const mapStateToProps = ({ authUser }) => {
  return {
    authUser,
    userId: authUser.user
  };
};

const mapDispatchToProps = (dispatch) => {
  const result = {
    authActions: bindActionCreators(authActionsAll, dispatch),
  }
  return result;
};

export default withRouter(injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(TopNavProfileSection))
);