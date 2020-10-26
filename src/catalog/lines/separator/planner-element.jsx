import { ElementsFactories } from '../../../react-planner';
import { DEFAULT_WALL_TITLE } from '../../../react-planner/constants';

const info = {
  title: DEFAULT_WALL_TITLE.separator,
  tag: ['separator'],
  description: 'Separator line',
  image: require('./separator.png'),
  visibility: {
    catalog: true,
    layerElementsVisible: true
  }
};

const properties = {
  thickness: {
    defaultValue: {
      length: 4
    }
  }
};

const textures = {
  dry: {
    name: 'Dry',
    uri: require('./textures/dry.jpg'),
    lengthRepeatScale: 0.01,
    heightRepeatScale: 0.01,
    normal: {
      uri: require('./textures/dry-normal.jpg'),
      lengthRepeatScale: 0.01,
      heightRepeatScale: 0.01,
      normalScaleX: 0.8,
      normalScaleY: 0.8
    }
  },
  wet: {
    name:'Wet',
    uri: require('./textures/wet.jpg'),
    lengthRepeatScale: 0.01,
    heightRepeatScale: 0.01,
    normal: {
      uri: require('./textures/wet-normal.jpg'),
      lengthRepeatScale: 0.01,
      heightRepeatScale: 0.01,
      normalScaleX: 0.4,
      normalScaleY: 0.4
    }
  },
};

export default ElementsFactories.WallFactory('separator', info, textures, properties);

