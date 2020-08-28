import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import * as projectActionsAll from '../../redux/projects/actions';
import { getAllProjects } from '../../redux/projects/selectors';
import ProjectListHeading from '../../containers/projects/ProjectListHeading';
import ProjectListing from '../../containers/projects/ProjectListing';


const getIndex = (value, arr, prop) => {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i][prop] === value) {
      return i;
    }
  }
  return -1;
};

const orderOptions = [
  { column: 'name', label: 'Name', direction: 'asc' },
  { column: 'updatedAt.seconds', label: 'Updated at', direction: 'desc' }
];
const pageSizes = [4, 8, 12, 20];

const ProjectList = ({ 
  match,
  isLoading,
  fetchRemoteProjectList,
  deleteRemoteProjects,
  userId, 
  projects 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPageSize, setSelectedPageSize] = useState(8);
  const [selectedOrderOption, setSelectedOrderOption] = useState({
    column: 'name',
    label: 'Name',
    direction: 'asc'
  });

  const [totalItemCount, setTotalItemCount] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [items, setItems] = useState([]);
  const [lastChecked, setLastChecked] = useState(null);

  useEffect(() => {
    const sortedProjects = _.orderBy(projects, [selectedOrderOption.column], [selectedOrderOption.direction]);
    const startIndex = (currentPage - 1) * selectedPageSize;
    const endIndex = currentPage * selectedPageSize;
    const newItems = _.slice(sortedProjects, startIndex, endIndex);
    setItems(newItems);
    setTotalItemCount(sortedProjects.length);
    setTotalPage(Math.ceil(sortedProjects.length/selectedPageSize));
    setSelectedItems([]);
  }, [projects, selectedPageSize, selectedOrderOption, currentPage]);

  useEffect(() => {
    fetchRemoteProjectList(userId);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPageSize, selectedOrderOption]);

  const onCheckItem = (event, id) => {
    if (
      event.target.tagName === 'A' ||
      (event.target.parentElement && event.target.parentElement.tagName === 'A')
    ) {
      return true;
    }
    if (lastChecked === null) {
      setLastChecked(id);
    }

    let selectedList = [...selectedItems];
    if (selectedList.includes(id)) {
      selectedList = selectedList.filter((x) => x !== id);
    } else {
      selectedList.push(id);
    }
    setSelectedItems(selectedList);

    if (event.shiftKey) {
      let newItems = [...items];
      const start = getIndex(id, newItems, 'id');
      const end = getIndex(lastChecked, newItems, 'id');
      newItems = newItems.slice(Math.min(start, end), Math.max(start, end) + 1);
      selectedItems.push(
        ...newItems.map((item) => {
          return item.id;
        })
      );
      selectedList = Array.from(new Set(selectedItems));
      setSelectedItems(selectedList);
    }
    document.activeElement.blur();
    return false;
  };

  const handleChangeSelectAll = (isToggle) => {
    if (selectedItems.length >= items.length) {
      if (isToggle) {
        setSelectedItems([]);
      }
    } else {
      setSelectedItems(items.map((x) => x.id));
    }
    document.activeElement.blur();
    return false;
  };

  const handleDeleteItems = () => {
    // const selectedIds = selectedItems
    deleteRemoteProjects(selectedItems);
  }


  const startIndex = (currentPage - 1) * selectedPageSize;
  const endIndex = currentPage * selectedPageSize;

  return isLoading ? (
    <div className="loading" />
  ) : (
      <>
        <div className="disable-text-selection">
          <ProjectListHeading
            handleChangeSelectAll={handleChangeSelectAll}
            changeOrderBy={(column) => {
              setSelectedOrderOption(
                orderOptions.find((x) => x.column === column)
              );
            }}
            changePageSize={setSelectedPageSize}
            selectedPageSize={selectedPageSize}
            totalItemCount={totalItemCount}
            selectedOrderOption={selectedOrderOption}
            match={match}
            startIndex={startIndex}
            endIndex={endIndex}
            selectedItemsLength={selectedItems ? selectedItems.length : 0}
            itemsLength={items ? items.length : 0}
            orderOptions={orderOptions}
            pageSizes={pageSizes}
            handleDeleteItems={handleDeleteItems}
          />
          <ProjectListing
            userId={userId}
            items={items}
            selectedItems={selectedItems}
            onCheckItem={onCheckItem}
            currentPage={currentPage}
            totalPage={totalPage}
            onChangePage={setCurrentPage}
          />
        </div>
      </>
    );
};


const mapStateToProps = (state) => {
  const { containerClassnames, authUser, projects } = state;
  const { loading } = projects;
  return {
    authUser,
    userId: authUser.user,
    containerClassnames,
    projects: getAllProjects(state),
    isLoading: loading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(projectActionsAll, dispatch)
  }
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProjectList)
);