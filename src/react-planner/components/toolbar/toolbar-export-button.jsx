import React from 'react';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import {FaFileExport as IconExport} from 'react-icons/fa';
import ToolbarButton from './toolbar-button';
import { csvDownload }  from '../../utils/browser';
import { Project } from '../../class/export';
import { GeometryUtils } from '../../utils/export';

export default function ToolbarExportButton({state}, {translator}) {

  let saveProjectElementsToFile = e => {
    e.preventDefault();
    state = Project.unselectAll( state ).updatedState;
    const scene = state.get('scene').toJS();

    const csvResult = [];

    _.map(scene.layers, layer => {
      const layerVertices = layer.vertices;
      const layerLines = layer.lines;
      const layerHoles = layer.holes;

      for (var key in layerLines) {
        if (layerLines.hasOwnProperty(key)) {
          const line = layerLines[key];
          if (_.isNil(line)) continue;
          if (_.isNil(line.vertices[0]) || _.isNil(layerVertices[line.vertices[0]])) continue;
          if (_.isNil(line.vertices[1]) || _.isNil(layerVertices[line.vertices[1]])) continue;

          const row = {
            Id: line.id,
            Sx: _.get(layerVertices[line.vertices[0]], 'x', 0),
            Sy: _.get(layerVertices[line.vertices[0]], 'y', 0),
            Ex: _.get(layerVertices[line.vertices[1]], 'x', 0),
            Ey: _.get(layerVertices[line.vertices[1]], 'y', 0),
            H: line.properties.height && line.properties.height.length ? line.properties.height.length : 300,
            Type: line.type,
            Wall_Type: 'Perimeter',
            Wall_Face_A: line.properties.textureA,
            Wall_Face_B: line.properties.textureB,
            Associated_Wall: ''
          };
          csvResult.push(row);
        }
      }

      for (var key in layerHoles) {
        if (layerHoles.hasOwnProperty(key)) {
          const hole = layerHoles[key];
          const line = _.get(layerLines, hole.line, undefined);

          if (_.isNil(hole) || _.isNil(line)) continue;

          const {x: x0, y: y0} = _.get(layer.vertices, line.vertices[0]);
          const {x: x1, y: y1} = _.get(layer.vertices, line.vertices[1]);

          const lineLength = GeometryUtils.pointsDistance(x0, y0, x1, y1);
          const linePassing = GeometryUtils.linePassingThroughTwoPoints(x0, y0, x1, y1);


          const startAt = lineLength * hole.offset - _.get(hole.properties, 'width.length') / 2;
          const endAt = startAt + _.get(hole.properties, 'width.length');

          let startAtX, startAtY, endAtX, endAtY;
          if (linePassing.a === 0) {
            // horizontal line
            startAtX = x0 + startAt;
            startAtY = y0;
            endAtX = x0 + endAt;
            endAtY = y0;
          } else if (linePassing.b === 0) {
            // vertical line
            startAtX = x0;
            startAtY = y0 + startAt;
            endAtX = x0;
            endAtY = y0 + endAt;
          } else {
            // normal line
            startAtX = x0 - ((startAt * (x0 - x1)) / lineLength);
            startAtY = (linePassing.c - linePassing.a * startAtX) / linePassing.b;
            endAtX = x0 - ((endAt * (x0 - x1)) / lineLength);
            endAtY = (linePassing.c - linePassing.a * endAtX) / linePassing.b;
          }

          const row = {
            Id: hole.id,
            Sx: startAtX,
            Sy: startAtY,
            Ex: endAtX,
            Ey: endAtY,
            H: hole.properties.height && line.properties.height.length ? line.properties.height.length : 300,
            Type: hole.type,
            Wall_Type: '',
            Wall_Face_A: line.properties.textureA,
            Wall_Face_B: line.properties.textureB,
            Associated_Wall: line.id
          };
          csvResult.push(row);
        }
      }
    });

    csvDownload(csvResult);
  };

  return (
    <ToolbarButton active={false} tooltip={translator.t('Export project')} onClick={saveProjectElementsToFile}>
      <IconExport />
    </ToolbarButton>
  );
}

ToolbarExportButton.propTypes = {
  state: PropTypes.object.isRequired,
};

ToolbarExportButton.contextTypes = {
  translator: PropTypes.object.isRequired,
};
