import { schema } from "normalizr";


const dialogSchema = new schema.Entity('dialogs', undefined, { idAttribute: 'name' });

export default dialogSchema;