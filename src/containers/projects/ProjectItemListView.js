import React from 'react';
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
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import { Colxx } from '../../components/common/CustomBootstrap';


const ProjectItemListView = ({ project, isSelect, onCheckItem }) => {
  return (
    <Colxx sm="6" lg="4" xl="3" className="mb-3" key={project.id}>
      <Card
        onClick={(event) => onCheckItem(event, project.id)}
        className={classnames({
          active: isSelect,
        })}
      >
        <div className="position-relative">
          <NavLink to={`/planner/${project.id}`} className="w-40 w-sm-100">
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

/* React.memo detail : https://reactjs.org/docs/react-api.html#reactpurecomponent  */
export default React.memo(ProjectItemListView);
