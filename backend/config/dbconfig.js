import 'dotenv/config';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env.db_name,
    process.env.db_user,
    process.env.db_password,
    {
        host: process.env.db_host,
        port: process.env.db_port, // Add port from .env
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