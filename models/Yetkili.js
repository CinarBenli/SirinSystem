const { DataTypes } = require("sequelize")
const sequelize = require("../database/db")

const Yetkili = sequelize.define("Yetkili",{
tc:{
type:DataTypes.STRING,
allowNull:false,
unique:true
},
sifre:{
type:DataTypes.STRING,
allowNull:false
},
telefon:{
type:DataTypes.STRING,
allowNull:false
},
mudurMu:{
type:DataTypes.BOOLEAN,
defaultValue:false
},
musteriEklemeYetkisi:{
type:DataTypes.BOOLEAN,
defaultValue:false
},
musteriSilmeYetkisi:{
type:DataTypes.BOOLEAN,
defaultValue:false
},
musteriGoruntulemeYetkisi:{
type:DataTypes.BOOLEAN,
defaultValue:false
},

admin:{
type:DataTypes.BOOLEAN,
defaultValue:false
}

})

module.exports = Yetkili