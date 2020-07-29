import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Layer from './layer';
import Grids from './grids/grids';

export default class Scene extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.scene.hashCode() !== nextProps.scene.hashCode();
  }

  render() {
    const { scene, catalog, drawingSupport } = this.props;
    const { layers } = scene;
    const selectedLayer = layers.get(scene.selectedLayer);

    return (
      <g>
        <Grids scene={scene} />

        <g style={{ pointerEvents: 'none' }}>
          {
            layers
              .entrySeq()
              .filter(([layerID, layer]) => layerID !== scene.selectedLayer && layer.visible)
              .map(([layerID, layer]) => <Layer key={layerID} layer={layer} scene={scene} catalog={catalog} />)
          }
        </g>

        <Layer key={selectedLayer.id} layer={selectedLayer} scene={scene} catalog={catalog} drawingSupport={drawingSupport} />
      </g>
    );
  }
}


Scene.propTypes = {
  scene: PropTypes.object.isRequired,
  catalog: PropTypes.object.isRequired
};
