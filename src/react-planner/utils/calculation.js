import areapolygon from 'area-polygon';

export default function calculateArea(area, layer) {
  const polygon = area.vertices.toArray().map((vertexID) => {
    const { x, y } = layer.vertices.get(vertexID);
    return [x, y];
  });

  let polygonWithHoles = polygon;

  area.holes.forEach((holeID) => {
    const polygonHole = layer.areas
      .get(holeID)
      .vertices.toArray()
      .map((vertexID) => {
        const { x, y } = layer.vertices.get(vertexID);
        return [x, y];
      });

    polygonWithHoles = polygonWithHoles.concat(polygonHole.reverse());
  });

  let areaSize = areapolygon(polygon, false);

  // subtract holes area
  area.holes.forEach((areaID) => {
    const hole = layer.areas.get(areaID);
    const holePolygon = hole.vertices.toArray().map((vertexID) => {
      const { x, y } = layer.vertices.get(vertexID);
      return [x, y];
    });
    areaSize -= areapolygon(holePolygon, false);
  });

  return areaSize ?? 0;
}