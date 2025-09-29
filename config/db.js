import { Sequelize } from "sequelize";
import { configDotenv } from "dotenv";

configDotenv();
let username = process.env.DB_USERNAME;
let password = process.env.DB_PASSWORD;

const sequelize = new Sequelize("postgres", username, password, {
    host: "localhost",
    dialect: "postgres",
    logging: false,
});

try {
    await sequelize.authenticate();
    console.log(`
        Connection to the database has been established successfully.
    `);
} catch (error) {
    console.error(`
        Couldn't connect to the database: ${error}
    `);
}

(async () => {
    await sequelize.sync({ alter: true});
})();

export default sequelize;
