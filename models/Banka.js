const { DataTypes } = require("sequelize")
const sequelize = require("../database/db")

const Banka = sequelize.define("Banka",{
id:{ type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true },
musteriId:{ type:DataTypes.INTEGER, allowNull:false },
isim:{ type:DataTypes.STRING(120), allowNull:false },
durum:{ type:DataTypes.ENUM("aktif","pasif","bloke","işlemde"), defaultValue:"işlemde" },
telefon:{ type:DataTypes.STRING(20) },
email:{ type:DataTypes.STRING(150) },
emailsifre:{ type:DataTypes.STRING(150) },

musteriNo:{ type:DataTypes.STRING(100) },
sifre:{ type:DataTypes.STRING(255) },
firmaNo:{ type:DataTypes.STRING(100) },
guvenlikResmi:{ type:DataTypes.STRING(100) },
sube:{ type:DataTypes.STRING(120) }
},{
tableName:"bankalar"
})

module.exports = Banka