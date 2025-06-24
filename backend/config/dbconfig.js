import 'dotenv/config';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT, // Add port from .env
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false, // For most managed Postgres services
            },
        },
    }
);

try {
    await sequelize.authenticate();
    console.log('database connection was successful');
} catch(error) {
    console.log('there was an error establishing database connection');
    console.error(error);
}

export default sequelize;