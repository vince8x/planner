import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Panel from './panel';
import * as SharedStyle from '../../shared-style';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { FaPencil, FaTrash, FaTimes } from 'react-icons/fa';
import { FormNumberInput } from '../../components/style/export';
import IntlMessages from '../../../helpers/IntlMessages';

const tabStyle = { margin: '1em' };

const iconStyle = {
  fontSize: '14px',
  margin: '2px',
  cursor: 'pointer'
};

const addGuideStyle = {
  cursor: 'pointer',
  height: '2em'
};

const tableTabStyle = {
  width: '100%',
  textAlign: 'center'
};

export default class PanelGuides extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      addHGVisible: true,
      addVGVisible: true,
      addCGVisible: true
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.addHGVisible !== nextState.addHGVisible ||
      this.state.addVGVisible !== nextState.addVGVisible ||
      this.state.addCGVisible !== nextState.addCGVisible ||
      this.props.state.getIn(['scene', 'guides']).hashCode() !==
        nextProps.state.getIn(['scene', 'guides']).hashCode()
    );
  }

  render() {
    let { state } = this.props;
    let { projectActions, translator, intl } = this.context;
    let { guides } = state.scene;

    return (
      <Panel name={intl.formatMessage({ id: 'planner.guides' })}>
        <Tabs id='guidesTabs' style={tabStyle}>
          <TabList>
            <Tab>
              <IntlMessages id='planner.horizontal' />
            </Tab>
            <Tab>
              <IntlMessages id='planner.vertical' />
            </Tab>
            {/*<Tab>{translator.t('Circular')}</Tab>*/}
          </TabList>

          <TabPanel>
            <table style={tableTabStyle}>
              <tbody>
                {guides
                  .get('horizontal')
                  .entrySeq()
                  .map(([hgKey, hgVal], ind) => {
                    return (
                      <tr key={hgKey}>
                        <td style={{ width: '2em' }}>{ind + 1}</td>
                        <td>{hgVal}</td>
                        <td style={{ width: '5em' }}>
                          {/*<FaPencil style={iconStyle} />*/}
                          <FaTrash
                            style={iconStyle}
                            onClick={e =>
                              projectActions.removeHorizontalGuide(hgKey)
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
                {this.state.addHGVisible ? (
                  <tr>
                    <td
                      colSpan='3'
                      style={addGuideStyle}
                      onClick={e => this.setState({ addHGVisible: false })}
                    >
                      <IntlMessages id='planner.add-horizontal-guide' />
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan='2'>
                      <FormNumberInput
                        value={0}
                        onChange={e => {
                          projectActions.addHorizontalGuide(e.target.value);
                          return this.setState({ addHGVisible: true });
                        }}
                        min={0}
                        max={this.props.state.getIn(['scene', 'height'])}
                      />
                    </td>
                    <td>
                      <FaTimes
                        style={iconStyle}
                        onClick={e => this.setState({ addHGVisible: true })}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </TabPanel>
          <TabPanel>
            <table style={tableTabStyle}>
              <tbody>
                {guides
                  .get('vertical')
                  .entrySeq()
                  .map(([hgKey, hgVal], ind) => {
                    return (
                      <tr key={hgKey}>
                        <td style={{ width: '2em' }}>{ind + 1}</td>
                        <td>{hgVal}</td>
                        <td style={{ width: '5em' }}>
                          {/*<FaPencil style={iconStyle} />*/}
                          <FaTrash
                            style={iconStyle}
                            onClick={e =>
                              projectActions.removeVerticalGuide(hgKey)
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
                {this.state.addVGVisible ? (
                  <tr>
                    <td
                      colSpan='3'
                      style={addGuideStyle}
                      onClick={e => this.setState({ addVGVisible: false })}
                    >
                      <IntlMessages id='planner.add-vertical-guide' />
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan='2'>
                      <FormNumberInput
                        value={0}
                        onChange={e => {
                          projectActions.addVerticalGuide(e.target.value);
                          return this.setState({ addVGVisible: true });
                        }}
                        min={0}
                        max={this.props.state.getIn(['scene', 'height'])}
                      />
                    </td>
                    <td>
                      <FaTimes
                        style={iconStyle}
                        onClick={e => this.setState({ addVGVisible: true })}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </TabPanel>
          {/*<TabPanel>
            <b>TODO Circular Giudes</b>
          </TabPanel>*/}
        </Tabs>
      </Panel>
    );
  }
}

PanelGuides.propTypes = {
  state: PropTypes.object.isRequired
};

PanelGuides.contextTypes = {
  translator: PropTypes.object.isRequired,
  projectActions: PropTypes.object.isRequired
};
