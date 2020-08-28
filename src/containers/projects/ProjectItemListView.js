import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import fromUnixTime from 'date-fns/fromUnixTime';
import {
  Row,
  Card,
  CardBody,
  CardSubtitle,
  CardImg,
  CardText,
  CustomInput,
} from 'reactstrap';
import { NavLink, useHistory } from 'react-router-dom';
import classnames from 'classnames';
import { Colxx } from '../../components/common/CustomBootstrap';
import * as projectActionsAll from '../../redux/projects/actions';


const ProjectItemListView = ({ project, isSelect, onCheckItem, loadRemoteProject }) => {

  const history = useHistory();

  const handleItemClick = (e, item) => {
    e.preventDefault();
    const { id } = item;
    loadRemoteProject(id, history);
  }

  return (
    <Colxx sm="6" lg="4" xl="3" className="mb-3" key={project.id}>
      <Card
        onClick={(event) => onCheckItem(event, project.id)}
        className={classnames({
          active: isSelect,
        })}
      >
        <div className="position-relative">
          <NavLink to={`/planner`} onClick={(e) => handleItemClick(e, project)} className="w-40 w-sm-100">
            <CardImg top alt={project.name} src='/assets/img/projects/default-thumb.png' />
          </NavLink>
        </div>
        <CardBody>
          <Row>
            <Colxx xxs="2">
              <CustomInput
                className="item-check mb-0"
                type="checkbox"
                id={`check_${project.id}`}
                checked={isSelect}
                onChange={() => { }}
                label=""
              />
            </Colxx>
            <Colxx xxs="10" className="mb-3">
              <CardSubtitle>{project.name}</CardSubtitle>
              <CardText className="text-muted text-small mb-0 font-weight-light">
                {fromUnixTime(project.updatedAt.seconds).toDateString()}
              </CardText>
            </Colxx>
          </Row>
        </CardBody>
      </Card>
    </Colxx>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(projectActionsAll, dispatch)
  }
};

export default connect(null, mapDispatchToProps)(ProjectItemListView);
