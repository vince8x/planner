import React, { useState, useEffect } from 'react';
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
import { storage } from '../../helpers/Firebase';
import { Colxx } from '../../components/common/CustomBootstrap';
import * as projectActionsAll from '../../redux/projects/actions';
import ProjectItemImg from './ProjectItemImg';




const ProjectItemListView = ({ userId, project, isSelect, onCheckItem, loadRemoteProject }) => {

  const history = useHistory();

  const [projectImageSrc, setProjectImageSrc] = useState(null);

  useEffect(() => {
    storage.ref(`images/${userId}/projects/${project.id}.png`).getDownloadURL()
      .then(url => setProjectImageSrc(url)) 
      .catch(error => console.error(error));
  }, []);

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
          <NavLink to='/planner' onClick={(e) => handleItemClick(e, project)} className="w-40 w-sm-100">
            {projectImageSrc && <ProjectItemImg alt={project.name} url={projectImageSrc} />}
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
