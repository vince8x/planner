import React from 'react';
import { Row } from 'reactstrap';
import ProjectItemListView from './ProjectItemListView';
import Pagination from '../common/Pagination';

const ProjectListing = ({
  items,
  selectedItems,
  onCheckItem,
  currentPage,
  totalPage,
  onChangePage,
}) => {
  return (
    <Row>
      {items.map((project) => {
        return (
          <ProjectItemListView
            key={project.id}
            project={project}
            isSelect={selectedItems.includes(project.id)}
            onCheckItem={onCheckItem}
          />
        );
      })}
      <Pagination
        currentPage={currentPage}
        totalPage={totalPage}
        onChangePage={(i) => onChangePage(i)}
      />
    </Row>
  );
};

export default React.memo(ProjectListing);
