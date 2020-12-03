import * as _ from 'lodash';
import { blobDownload } from './browser';

export default function exportImage(imageBlob, projectName) {
  const exportFileName =
    _.isNil(projectName) || _.isEmpty(projectName)
      ? 'result_generate_' + Date.now() + '.png'
      : projectName + '_' + Date.now() + '.png';
  blobDownload(imageBlob, exportFileName);
}
