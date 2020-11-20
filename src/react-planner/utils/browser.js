import { saveAs } from 'file-saver';
import * as _ from 'lodash';

export function browserDownload(json) {

  let filename = 'output' + Date.now() + '.json';
  filename = window.prompt('Insert output filename', filename);
  if (!filename) return;

  const output = JSON.stringify(json);

  const file = new File([output], filename, {type: "text/plain;charset=utf-8"});
  saveAs(file);
}

export function browserUpload() {
  return new Promise(function (resolve, reject) {

    let fileInput = document.createElement('input');
    fileInput.type = 'file';

    fileInput.addEventListener('change', function (event) {
      let file = event.target.files[0];
      let reader = new FileReader();
      reader.addEventListener('load', (fileEvent) => {
        let loadedData = fileEvent.target.result;
        resolve(loadedData);
      });
      reader.readAsText(file);
    });

    fileInput.click();
  });
}

export function csvDownload(json, filename) {
  if (_.isNil(json) || _.isNil(json[0])) {
    return;
  }

  const exportFileName = filename || 'result_generate_' + Date.now() + '.csv';

  const headers = Object.keys(json[0]);

  let csvContent = "";

  csvContent += headers.join(';');
  csvContent += "\r\n";

  _.map(json, row => {
    const rowArray = [];
    _.map(headers, header => {
      rowArray.push(row[header]);
    });
    const rowStr = rowArray.join(';');
    csvContent += rowStr + "\r\n";
  });

  const blob = new Blob([csvContent], { type: "data:text/csv;charset=utf-8" });
  saveAs(blob, exportFileName);
}
