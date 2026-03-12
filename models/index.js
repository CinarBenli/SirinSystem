const sequelize = require("../database/db")
const Musteri = require("./Musteri")
const Banka = require("./Banka")
const Bankas = require("./Bankas")
const Yetkili = require("./Yetkili")

// Banka ilişkisi
Musteri.hasMany(Banka,{foreignKey:"musteriId",as:"bankalar"})
Banka.belongsTo(Musteri,{foreignKey:"musteriId",as:"sahip"})

// Bankas ilişkisi
Musteri.hasMany(Bankas,{foreignKey:"musteriId",as:"bankalars"})
Bankas.belongsTo(Musteri,{foreignKey:"musteriId",as:"sahip"})

module.exports = { 
  sequelize, 
  Musteri, 
  Banka,
  Bankas,
  Yetkili
}