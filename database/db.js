const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("Sirin", "DataBen", "ben34ben34", {
  host: "159.146.54.58",
  dialect: "mysql",
  logging: false
});

sequelize.authenticate()
  .then(() => {
    console.log("✅ MySQL’e başarıyla bağlanıldı!");
  })
  .catch((err) => {
    console.error("❌ MySQL bağlantı hatası:", err);
  });

sequelize.sync()
  .then(() => {
    console.log("✅ Database senkronize edildi!");
  })
  .catch((err) => {
    console.error("❌ Database senkronize hatası:", err);
  });

module.exports = sequelize;