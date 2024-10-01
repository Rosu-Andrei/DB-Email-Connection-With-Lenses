import {ObjectDef} from "../RenderObject";
import {DatabaseConnection} from "../../domain/DatabaseConnection";

export const oracleDatabaseConnection: ObjectDef<DatabaseConnection> = {
    host: 'text',
    port: 'text',
    user: 'text',
    password: 'text',
    serviceName: "text",
    sid: "text"
}