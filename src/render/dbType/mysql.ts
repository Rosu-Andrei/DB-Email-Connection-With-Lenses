import {ObjectDef} from "../RenderObject";
import {DatabaseConnection} from "../../domain/DatabaseConnection";

export const MySqlDatabasConnection: ObjectDef<DatabaseConnection> = {
    host: "text",
    port: "text",
    user: "text",
    password: "text",
    database: 'text',
    ssl: 'text'
}