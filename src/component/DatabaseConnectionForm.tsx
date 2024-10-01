import {renderObject} from "../render/RenderObject";
import {dbConnection} from "../render/dbType/all.db.connections";

export const DatabaseConnectionForm = renderObject(dbConnection, 'db');