const { DataTypes } = require("sequelize")
const sequelize = require("../database/db")

const Bankas = sequelize.define("Bankas",{
id:{ type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true },
musteriId:{ type:DataTypes.INTEGER, allowNull:false },
isim:{ type:DataTypes.STRING(120), allowNull:false },
durum:{ type:DataTypes.ENUM("aktif","pasif","bloke","işlemde"), defaultValue:"işlemde" },
telefon:{ type:DataTypes.STRING(20) },
email:{ type:DataTypes.STRING(150) },
tc:{ type:DataTypes.STRING(100) },
sifre:{ type:DataTypes.STRING(255) },
guvenlikResmi:{ type:DataTypes.STRING(100) },
sube:{ type:DataTypes.STRING(120) }
},{
tableName:"bankalars"
})

module.exports = Bankas