import {ObjectDef} from "../RenderObject";
import {DatabaseConnection} from "../../domain/DatabaseConnection";

export const SqlServerDatabaseConnection: ObjectDef<DatabaseConnection> = {
    host: "text",
    port: "text",
    user: "text",
    password: "text",
    instanceName: "text",
    encrypt: "text"
}