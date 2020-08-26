import React, { useState, useEffect } from 'react';
import ProjectListHeading from '../../containers/projects/ProjectListHeading';


const getIndex = (value, arr, prop) => {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i][prop] === value) {
      return i;
    }
  }
  return -1;
};

const orderOptions = [
  { column: 'name', label: 'Product Name' },
  { column: 'updatedAt', label: 'Updated' }
];
const pageSizes = [4, 8, 12, 20];

const ProjectList = ({ match }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPageSize, setSelectedPageSize] = useState(8);
  const [selectedOrderOption, setSelectedOrderOption] = useState({
    column: 'name',
    label: 'Project Name',
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [totalItemCount, setTotalItemCount] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [items, setItems] = useState([]);
  const [lastChecked, setLastChecked] = useState(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPageSize, selectedOrderOption]);

  useEffect(() => {
    
          // setTotalPage(data.totalPage);
          // setItems(data.data.map(x => { return { ...x, img: x.img.replace("img/", "img/products/") } }));
          // setSelectedItems([]);
          // setTotalItemCount(data.totalItem);
          // setIsLoaded(true);
  }, []);

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



  const startIndex = (currentPage - 1) * selectedPageSize;
  const endIndex = currentPage * selectedPageSize;

  return !isLoaded ? (
    <div className="loading" />
  ) : (
      <>
        <div className="disable-text-selection">
          <ProjectListHeading
            heading="menu.image-list"
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
            onSearchKey={(e) => {
              if (e.key === 'Enter') {
                setSearch(e.target.value.toLowerCase());
              }
            }}
            orderOptions={orderOptions}
            pageSizes={pageSizes}
            toggleModal={() => setModalOpen(!modalOpen)}
          />
          {/* <ListPageListing
            items={items}
            displayMode={displayMode}
            selectedItems={selectedItems}
            onCheckItem={onCheckItem}
            currentPage={currentPage}
            totalPage={totalPage}
            onContextMenuClick={onContextMenuClick}
            onContextMenu={onContextMenu}
            onChangePage={setCurrentPage}
          /> */}
        </div>
      </>
    );
};



// const mapStateToProps = ({ menu, settings, planner }) => {
//   const { containerClassnames, menuClickCount, selectedMenuHasSubItems } = menu;
//   const { locale } = settings;
//   return {
//     containerClassnames,
//     menuClickCount,
//     selectedMenuHasSubItems,
//     locale,
//     statePlanner: planner,
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   const result = {
//     localeActions: bindActionCreators(localeActionsAll, dispatch),
//     ...objectsMap(actions, actionNamespace => bindActionCreators(actions[actionNamespace], dispatch)),
//     showSaveProjectAsDialog: () => dispatch(openDialog('saveProjectDialog'))
//   }
//   return result;
// };

export default ProjectList;