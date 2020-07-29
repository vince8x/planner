import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect, ReactReduxContext } from 'react-redux';

import Translator from './translator/translator';
import Catalog from './catalog/catalog';
import actions from './actions/export';
import { objectsMap } from './utils/objects-utils';
import {
  ToolbarComponents,
  Content,
  SidebarComponents,
  FooterBarComponents
} from './components/export';
import { VERSION } from './version';
import './styles/export';

const { Toolbar } = ToolbarComponents;
const { Sidebar } = SidebarComponents;
const { FooterBar } = FooterBarComponents;

const toolbarW = 50;
const sidebarW = 300;
const footerBarH = 20;

const wrapperStyle = {
  display: 'flex',
  flexFlow: 'row nowrap'
};

class ReactPlanner extends Component {

  // eslint-disable-next-line react/static-property-placement
  static contextType = ReactReduxContext;


  getChildContext() {
    return {
      ...objectsMap(actions, actionNamespace => this.props[actionNamespace]),
      translator: this.props.translator,
      catalog: this.props.catalog,
    }
  }

  UNSAFE_componentWillMount() {
    let {store} = this.context;
    let {projectActions, catalog, stateExtractor, plugins} = this.props;
    plugins.forEach(plugin => plugin(store, stateExtractor));
    projectActions.initCatalog(catalog);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { stateExtractor, state, projectActions, catalog } = nextProps;
    const plannerState = stateExtractor(state);
    const catalogReady = plannerState.getIn(['catalog', 'ready']);
    if (!catalogReady) {
      projectActions.initCatalog(catalog);
    }
  }

  render() {
    const { width, height, state, stateExtractor, ...props } = this.props;

    const contentW = width - toolbarW - sidebarW;
    const toolbarH = height - footerBarH > 0 ? height - footerBarH : 0;
    // let toolbarH = height;
    const contentH = height - footerBarH > 0 ? height - footerBarH : 0;
    // let contentH = height;
    const sidebarH = height - footerBarH > 0 ? height - footerBarH : 0;
    // let sidebarH = height;
    // const toolbarH = 400;
    // const contentH = 400;
    // const sidebarH = 400;

    const extractedState = stateExtractor(state);

    return (
      <div style={{ ...wrapperStyle, height }}>
        <Toolbar width={toolbarW} height={toolbarH} state={extractedState} {...props} />
        <Content width={contentW} height={contentH} state={extractedState} {...props} onWheel={event => event.preventDefault()} />
        <Sidebar width={sidebarW} height={sidebarH} state={extractedState} {...props} />
        <FooterBar width={width} height={footerBarH} state={extractedState} {...props} />
      </div>
    );
  }
}

ReactPlanner.propTypes = {
  translator: PropTypes.instanceOf(Translator),
  catalog: PropTypes.instanceOf(Catalog),
  allowProjectFileSupport: PropTypes.bool,
  plugins: PropTypes.arrayOf(PropTypes.func),
  autosaveKey: PropTypes.string,
  autosaveDelay: PropTypes.number,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  stateExtractor: PropTypes.func.isRequired,
  toolbarButtons: PropTypes.array,
  sidebarComponents: PropTypes.array,
  footerbarComponents: PropTypes.array,
  customContents: PropTypes.object,
  softwareSignature: PropTypes.string
};

ReactPlanner.childContextTypes = {
  ...objectsMap(actions, () => PropTypes.object),
  translator: PropTypes.object,
  catalog: PropTypes.object,
};

ReactPlanner.defaultProps = {
  translator: new Translator(),
  catalog: new Catalog(),
  plugins: [],
  allowProjectFileSupport: true,
  softwareSignature: `DEODEM UC ${VERSION}`,
  toolbarButtons: [],
  sidebarComponents: [],
  footerbarComponents: [],
  customContents: {},
};

// redux connect
function mapStateToProps(reduxState) {
  const { planner } = reduxState;
  return {
    state: planner
  };
}

function mapDispatchToProps(dispatch) {
  return objectsMap(actions, actionNamespace => bindActionCreators(actions[actionNamespace], dispatch));
}

export default connect(mapStateToProps, mapDispatchToProps)(ReactPlanner);
