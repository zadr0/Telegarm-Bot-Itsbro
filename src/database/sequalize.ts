import { Sequelize, DataTypes } from "sequelize";
import "dotenv/config";

export const admin = new Sequelize(process.env.sql_DB, process.env.sql_user, process.env.sql_password, {
    dialect: "mysql",
    host: process.env.sql_host,
    logging: false,
    define: {
        timestamps: false
    },
});

export namespace models {
    export const EconomyModel = admin.define('Economy', {
        userId: {
            type: DataTypes.STRING(255),
            unique: true,
            primaryKey: true,
        },
        value: {
            type: DataTypes.BIGINT,
            defaultValue: 0,
        },
    });

    export const ModModel = admin.define('Moderation', {
        EventId: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.STRING(255),
        },
        expired: {
            type: DataTypes.DATE,
        },
        reason: {
            type: DataTypes.STRING(255)
        },
        chatId: {
            type: DataTypes.STRING(255)
        },
        punish: {
            type: DataTypes.STRING(255),
        },
    });
};

await (async () => {
    await admin.sync({ force: true })
})();






