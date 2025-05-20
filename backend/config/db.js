import db from "./dbconfig.js";

try {
  await db.sequelize.authenticate();
  console.log('✅ Database connection established successfully');
} catch (error) {
  console.error('❌ Unable to connect to the database:', error);
}

export default db;