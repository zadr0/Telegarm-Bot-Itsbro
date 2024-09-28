import { Sequelize, DataTypes } from "sequelize";
import "dotenv/config";
export const admin = new Sequelize(process.env.sql_DB, process.env.sql_user, process.env.sql_password, {
    dialect: "mysql",
    host: process.env.sql_host,
    logging: false,
    define: {
        timestamps: false
    }
});
export const EconomyModel = admin.define('Economy', {
    userId: {
        type: DataTypes.STRING(255),
        unique: true,
        primaryKey: true
    },
    value: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    }
});
(async ()=>{
    await admin.sync();
})();
