import { ProviderToObjectDef } from "../RenderObject";
import { ValidTypes } from "../../domain/ValidTypes";
import { oracleDatabaseConnection } from "./oracle";
import { postgresDatabaseConnection } from "./postgres";
import { MySqlDatabasConnection } from "./mysql";
import { SqlServerDatabaseConnection } from "./sqlServer";
import { smtpEmailConnection } from "./smtp";
import { sendgridEmailConnection } from "./sendgrid";

export const connectionDefinitions: ProviderToObjectDef<ValidTypes> = {
    oracle: { db: oracleDatabaseConnection },
    postgres: { db: postgresDatabaseConnection },
    mysql: { db: MySqlDatabasConnection },
    sqlServer: { db: SqlServerDatabaseConnection },
    smtp: { email: smtpEmailConnection },
    sendgrid: { email: sendgridEmailConnection },
}
