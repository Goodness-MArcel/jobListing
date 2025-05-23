import 'dotenv/config';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env.db_name,
    process.env.db_user,
    process.env.db_password,
    {
        host: process.env.db_host,
        dialect: 'postgres',
        logging: false
    }
);

try {
    await sequelize.authenticate();
    console.log('database connection was successful');
} catch(error) {
    console.log('there was an error establishing database connection');
}

export default sequelize;