export default function saveSVGScreenshotToFile(callback) {
  // First of all I need the svg content of the viewer
  const svgElements = document.getElementsByTagName('svg');

  // I get the element with max width (which is the viewer)
  let maxWidthSVGElement = svgElements[0];
  for (let i = 1; i < svgElements.length; i++) {
    if (svgElements[i].width.baseVal.value > maxWidthSVGElement.width.baseVal.value) {
      maxWidthSVGElement = svgElements[i];
    }
  }

  const serializer = new XMLSerializer();

  const img = new Image;

  // I create the new canvas to draw
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Set width and height for the new canvas
  const heightAtt = document.createAttribute('height');
  heightAtt.value = maxWidthSVGElement.height.baseVal.value;
  canvas.setAttributeNode(heightAtt);

  const widthAtt = document.createAttribute('width');
  widthAtt.value = maxWidthSVGElement.width.baseVal.value;
  canvas.setAttributeNode(widthAtt);

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  img.crossOrigin = 'anonymous';
  img.src = `data:image/svg+xml;base64,${window.btoa(serializer.serializeToString(maxWidthSVGElement))}`;

  img.onload = () => {
    ctx.drawImage(img, 0, 0, maxWidthSVGElement.width.baseVal.value, maxWidthSVGElement.height.baseVal.value);
    canvas.toBlob((blob) => {
      callback(blob);
    });
  };

};