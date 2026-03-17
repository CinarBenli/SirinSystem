const { DataTypes } = require("sequelize")
const sequelize = require("../database/db")
const Banka = require("./Banka")

const Musteri = sequelize.define("Musteri",{
id:{ type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true },
adSoyad:{ type:DataTypes.STRING(150), allowNull:false },
email:{ type:DataTypes.STRING(150), allowNull:false, validate:{isEmail:true} },
telefon:{ type:DataTypes.STRING(20), allowNull:false },
tc:{ type:DataTypes.STRING(11), allowNull:false },
AcoountStatus:{ type:DataTypes.STRING(100) }, //Active - Disable - Waiting
DailyCode:{ type:DataTypes.STRING(100) },

bankaAcmaSebebi:{ type:DataTypes.STRING(100) },
yetkili:{ type:DataTypes.STRING(120) },

il:{ type:DataTypes.STRING(100) },
ilce:{ type:DataTypes.STRING(100) },
mahalle:{ type:DataTypes.STRING(150) },
netadres:{ type:DataTypes.STRING(150) },

ikametgahBelgesi:{ type:DataTypes.STRING },
kimlikOnFoto:{ type:DataTypes.STRING },
kimlikArkaFoto:{ type:DataTypes.STRING },
yuzFoto:{ type:DataTypes.STRING },
not: { type:DataTypes.STRING }
},{
tableName:"musteriler"
})

module.exports = Musteri