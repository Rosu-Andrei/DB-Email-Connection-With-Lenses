import {DatabaseToObjectDef} from "../RenderObject";
import {ValidTypes} from "../../domain/ValidTypes";
import {oracleDatabaseConnection} from "./oracle";
import {postgresDatabaseConnection} from "./postgres";
import {MySqlDatabasConnection} from "./mysql";
import {SqlServerDatabaseConnection} from "./sqlServer";

export const dbConnection: DatabaseToObjectDef<ValidTypes> = {
    oracle: {db: oracleDatabaseConnection, email: {}},
    postgres: {db: postgresDatabaseConnection, email: {}},
    mysql: {db: MySqlDatabasConnection, email: {}},
    sqlServer: {db: SqlServerDatabaseConnection, email: {}}
}