/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */

// import { Catalog } from 'react-planner';
import Catalog from '../react-planner/catalog/catalog';
import * as Areas from './areas/area/planner-element';
import * as PerimeterWall from './lines/wall/planner-element';
import * as InteriorWall from './lines/interior-wall/planner-element';
import * as DividingWall from './lines/dividing-wall/planner-element';
// import * as Holes from './holes/**/planner-element.jsx';
// import * as Items from './items/**/planner-element.jsx';
import * as Doors from './holes/door/planner-element';
import * as Window from './holes/window/planner-element';
import * as Gates from './holes/gate/planner-element';


const catalog = new Catalog();

for( const x in Areas ) catalog.registerElement( Areas[x] );
for( const x in PerimeterWall ) catalog.registerElement( PerimeterWall[x] );
for( const x in InteriorWall ) catalog.registerElement( InteriorWall[x] );
for( const x in DividingWall ) catalog.registerElement( DividingWall[x] );
// for( let x in Holes ) catalog.registerElement( Holes[x] );
// for( let x in Items ) catalog.registerElement( Items[x] );
for( const x in Doors ) catalog.registerElement( Doors[x] );
for( const x in Window ) catalog.registerElement( Window[x] );
for( const x in Gates ) catalog.registerElement( Gates[x] );

// catalog.registerCategory('windows', 'Windows', [Holes.window, Holes.sashWindow, Holes.venetianBlindWindow, Holes.windowCurtain] );
// catalog.registerCategory('doors', 'Doors', [Holes.door, Holes.doorDouble, Holes.panicDoor, Holes.panicDoorDouble, Holes.slidingDoor] );

export default catalog;
