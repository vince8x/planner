import React from 'react';
import * as _ from 'lodash';
import { buildWall, updatedWall } from './wall-factory-3d';
import * as SharedStyle from '../../shared-style';
import * as Geometry from '../../utils/geometry';
import Translator from '../../translator/translator';

const epsilon = 20;
const STYLE_TEXT = { textAnchor: 'middle' };
const STYLE_LINE = { stroke: SharedStyle.LINE_MESH_COLOR.selected };
const STYLE_RECT = { strokeWidth: 1, stroke: SharedStyle.LINE_MESH_COLOR.unselected, fill: 'url(#diagonalFill)' };
const STYLE_RECT_RED = { strokeWidth: 1, stroke: SharedStyle.LINE_MESH_COLOR.unselected, fill: 'url(#diagonalFillRed)' };
const STYLE_RECT_GREEN = { strokeWidth: 1, stroke: SharedStyle.LINE_MESH_COLOR.unselected, fill: 'url(#diagonalFillGreen)' };
const STYLE_RECT_SELECTED = { ...STYLE_RECT, stroke: SharedStyle.LINE_MESH_COLOR.selected };

let translator = new Translator();

export default function WallFactory(name, info, textures, properties) {

  let wallElement = {
    name,
    prototype: 'lines',
    info,
    properties: {
      height: {
        label: translator.t('height'),
        type: 'length-measure',
        defaultValue: {
          length: 300,
        }
      },
      thickness: {
        label: translator.t('thickness'),
        type: 'length-measure',
        defaultValue: {
          length: 20
        }
      }
    },

    render2D: function (element, layer, scene) {
      let { x: x1, y: y1 } = layer.vertices.get(element.vertices.get(0));
      let { x: x2, y: y2 } = layer.vertices.get(element.vertices.get(1));

      let length = Geometry.pointsDistance(x1, y1, x2, y2);
      let length_5 = length / 5;

      let thickness = element.getIn(['properties', 'thickness', 'length']);
      let half_thickness = thickness / 2;
      let half_thickness_eps = half_thickness + epsilon;
      let char_height = 11;
      let extra_epsilon = 5;
      let textDistance = half_thickness + epsilon + extra_epsilon;

      const wallType = element.get('type');
      let styleRect = wallType === 'interior-wall' ? STYLE_RECT_RED :
        wallType === 'dividing-wall' ? STYLE_RECT_GREEN : STYLE_RECT;

      let styleRectSelect = { ...styleRect, stroke: SharedStyle.LINE_MESH_COLOR.selected };

      return (element.selected) ?
        <g>
          <rect x="0" y={-half_thickness} width={length} height={thickness} style={styleRectSelect} />
          <line x1={length_5} y1={-half_thickness_eps} x2={length_5} y2={half_thickness_eps} style={STYLE_LINE} />
          <text x={length_5} y={textDistance + char_height} style={STYLE_TEXT}>A</text>
          <text x={length_5} y={-textDistance} style={STYLE_TEXT}>B</text>
        </g> :
        <rect x="0" y={-half_thickness} width={length} height={thickness} style={styleRect} />
    },

    render3D: function (element, layer, scene) {
      return buildWall(element, layer, scene, textures);
    },

    updateRender3D: (element, layer, scene, mesh, oldElement, differences, selfDestroy, selfBuild) => {
      return updatedWall(element, layer, scene, textures, mesh, oldElement, differences, selfDestroy, selfBuild);
    }

  };

  if (textures && textures !== {}) {

    let textureValues = { 'none': 'None' };

    for (let textureName in textures) {
      textureValues[textureName] = textures[textureName].name;
    }

    wallElement.properties.textureA = {
      label: translator.t('texture') + ' A',
      type: 'enum',
      defaultValue: textureValues.dry ? 'dry' : 'none',
      values: textureValues
    };

    wallElement.properties.textureB = {
      label: translator.t('texture') + ' B',
      type: 'enum',
      defaultValue: textureValues.dry ? 'dry' : 'none',
      values: textureValues
    };

  }

  if (!_.isNil(properties))  {
    _.merge(wallElement.properties, properties);
  }

  return wallElement;
}
