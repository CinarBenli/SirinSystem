const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const upload = require("../middlewares/multer")
const { Op } = require("sequelize")
const LoggedIn = require("../middlewares/LoggedIn")
const session = require("express-session")

const { Musteri, Banka, Bankas, Yetkili } = require("../models")


router.post("/customer/:musteriId/delete", LoggedIn, async (req, res) => {
    try {
        const { musteriId } = req.params

        const silen = req.session.user
        if(!silen) return res.status(401).send("Giriş gerekli")

        if(silen.mudur !== 1){
            return res.status(403).send("Bu işlemi yapmak için müdür yetkiniz olmalı")
        }

        const musteri = await Musteri.findByPk(musteriId)
        if(!musteri) return res.status(404).send("Müşteri bulunamadı")

        console.log(`Müşteri ID ${musteriId} (${musteri.isim}) silindi. Silen kişi: ${silen.id} - ${silen.tc}`)

        await Banka.destroy({ where:{ musteriId } })
        await Bankas.destroy({ where:{ musteriId } })

        await musteri.destroy()

        res.redirect("/admin/customers")

    } catch(err){
        console.error(err)
        res.status(500).send("Sunucu hatası")
    }
})


router.get("/customer/:musteriId/bankas/:bankaId/delete", LoggedIn, async (req,res)=>{
    try{
        const { musteriId, bankaId } = req.params

        const banka = await Banka.findOne({ where:{ id:bankaId, musteriId } })
        if(!banka) return res.status(404).send("Banka bulunamadı")

        await banka.destroy()

        res.redirect(`/admin/customer/${musteriId}`)
    }catch(err){
        console.error(err)
        res.status(500).send("Sunucu hatası")
    }
})


router.get("/customer/:musteriId/banka/:bankaId/delete", LoggedIn, async (req,res)=>{
    try{
        const { musteriId, bankaId } = req.params

        const banka = await Banka.findOne({ where:{ id:bankaId, musteriId } })
        if(!banka) return res.status(404).send("Banka bulunamadı")

        await banka.destroy()

        res.redirect(`/admin/customer/${musteriId}`)
    }catch(err){
        console.error(err)
        res.status(500).send("Sunucu hatası")
    }
})

router.get("/customer/:musteriId/banka/add",LoggedIn, async (req, res) => {
    try {
        const musteriId = req.params.musteriId

        res.render("admin/customer_bankadd", {
            action: `/admin/customer/${musteriId}/banka/add`,
            musteriId,
            banka: null
        })
    } catch(err) {
        console.error(err)
        res.status(500).send("Sunucu hatası")
    }
})

router.get("/customer/:musteriId/banka/addd",LoggedIn, async (req, res) => {
    try {
        const musteriId = req.params.musteriId

        res.render("admin/customer_bankaddd", {
            action: `/admin/customer/${musteriId}/banka/addd`,
            musteriId,
            banka: null
        })
    } catch(err) {
        console.error(err)
        res.status(500).send("Sunucu hatası")
    }
})


router.get("/customer/:musteriId/banka/:bankaId/editt",LoggedIn, async (req, res) => {
    try {
        const { musteriId, bankaId } = req.params
        const banka = await Bankas.findByPk(bankaId)

        if(!banka) return res.status(404).send("Banka bulunamadı")

        res.render("./admin/customer_bank_editt", {
            action: `/admin/customer/${musteriId}/banka/${bankaId}/editt`,
            musteriId,
            banka
        })
     } catch(err) {
        console.error(err)
        res.status(500).send("Sunucu hatası")
    }
})


router.get("/customer/:musteriId/banka/:bankaId/edit", LoggedIn, async (req, res) => {
    try {
        const { musteriId, bankaId } = req.params
        const banka = await Banka.findByPk(bankaId)

        if(!banka) return res.status(404).send("Banka bulunamadı")

        res.render("./admin/customer_bank_edit", {
            action: `/admin/customer/${musteriId}/banka/${bankaId}/edit`,
            musteriId,
            banka
        })
    } catch(err) {
        console.error(err)
        res.status(500).send("Sunucu hatası")
    }
})

router.post("/customer/:musteriId/banka/addd", LoggedIn, async (req, res) => {
    try {
        const musteriId = req.params.musteriId
        const data = req.body

        const bankaData = {
            musteriId,
            isim: data.isim || '-',
            durum: data.durum || 'işlemde',
            telefon: data.telefon || '-',
            email: data.email || '-',
            tc: data.musteriNo || '-',
            sifre: data.sifre || '-',
            guvenlikResmi: data.guvenlikResmi || '-',
            sube: data.sube || '-'
        }

        await Bankas.create(bankaData)

        res.redirect(`/admin/customer/${musteriId}`) // geri müşteri sayfasına
    } catch(err){
        console.error(err)
        res.status(500).send("Sunucu hatası")
    }
})
router.post("/customer/:musteriId/banka/add", LoggedIn, async (req, res) => {
    try {
        const musteriId = req.params.musteriId
        const data = req.body

        const bankaData = {
            musteriId,
            isim: data.isim || '-',
            durum: data.durum || 'işlemde',
            telefon: data.telefon || '-',
            email: data.email || '-',
            musteriNo: data.musteriNo || '-',
            sifre: data.sifre || '-',
            firmaNo: data.firmaNo || '-',
            guvenlikResmi: data.guvenlikResmi || '-',
            sube: data.sube || '-'
        }

        await Banka.create(bankaData)

        res.redirect(`/admin/customer/${musteriId}`) // geri müşteri sayfasına
    } catch(err){
        console.error(err)
        res.status(500).send("Sunucu hatası")
    }
})

// Düzenleme (edit)
router.post("/customer/:musteriId/banka/:bankaId/edit", LoggedIn, async (req,res)=>{
    try{
        const { musteriId, bankaId } = req.params
        const data = req.body

        const banka = await Banka.findByPk(bankaId)
        if(!banka) return res.status(404).send("Banka bulunamadı")

        // Güncelleme
        banka.isim = data.isim || '-'
        banka.durum = data.durum || 'işlemde'
        banka.telefon = data.telefon || '-'
        banka.email = data.email || '-'
        banka.musteriNo = data.musteriNo || '-'
        banka.sifre = data.sifre || '-'
        banka.firmaNo = data.firmaNo || '-'
        banka.guvenlikResmi = data.guvenlikResmi || '-'
        banka.sube = data.sube || '-'

        await banka.save()
        res.redirect(`/admin/customer/${musteriId}`)
    } catch(err){
        console.error(err)
        res.status(500).send("Sunucu hatası")
    }
})

router.post("/customers/update/:id",LoggedIn, async (req,res)=>{
    try{

        const id = req.params.id
        const data = req.body

        const musteri = await Musteri.findByPk(id)
        if(!musteri) return res.status(404).send("Müşteri bulunamadı")

        musteri.AcoountStatus = data.AcoountStatus || "işlemde"
        musteri.email = data.email || "-"
        musteri.telefon = data.telefon || "-"
        musteri.not = data.not || "-"

        await musteri.save()

        res.redirect("/admin/customer/"+id)

    }catch(err){
        console.error(err)
        res.status(500).send("Sunucu hatası")
    }
})

// Düzenleme (edit)
router.post("/customer/:musteriId/banka/:bankaId/editt", LoggedIn, async (req,res)=>{
    try{
        const { musteriId, bankaId } = req.params
        const data = req.body

        const banka = await Bankas.findByPk(bankaId)
        if(!banka) return res.status(404).send("Banka bulunamadı")

        // Güncelleme
        banka.isim = data.isim || '-'
        banka.durum = data.durum || 'işlemde'
        banka.telefon = data.telefon || '-'
        banka.email = data.email || '-'
        banka.musteriNo = data.musteriNo || '-'
        banka.sifre = data.sifre || '-'
        banka.firmaNo = data.firmaNo || '-'
        banka.guvenlikResmi = data.guvenlikResmi || '-'
        banka.sube = data.sube || '-'

        await banka.save()
        res.redirect(`/admin/customer/${musteriId}`)
    } catch(err){
        console.error(err)
        res.status(500).send("Sunucu hatası")
    }
})








//-----------
router.get("/customers", LoggedIn, async (req, res) => {
try {
const customers = await Musteri.findAll()

res.render("./admin/customers", {
title: "Müşteriler",
customers
})
} catch (err) {
console.error(err)
res.status(500).send("Sunucu hatası")
}
});



router.get("/customer/:id/bankadd", LoggedIn, async (req, res) => {
try {
const id = req.params.id
const person = await Musteri.findByPk(id,{
include:[
{
model: Banka,
as: "bankalar"
},

{
model: Bankas,
as: "bankalars"
}
]
})

if(!person){
return res.status(404).send("Müşteri bulunamadı")
}

res.render("./admin/customer_detail",{
title:"Yönetim Paneli",
person
})

}catch(err){
console.error(err)
res.status(500).send("Sunucu hatası")
}

});

router.get("/customer/:id", LoggedIn, async (req, res) => {
try {
const id = req.params.id
const person = await Musteri.findByPk(id,{
include:[
{
model: Banka,
as: "bankalar"
},

{
model: Bankas,
as: "bankalars"
}
]
})

if(!person){
return res.status(404).send("Müşteri bulunamadı")
}

res.render("./admin/customer_detail",{
title:"Yönetim Paneli",
person
})

}catch(err){
console.error(err)
res.status(500).send("Sunucu hatası")
}

});


router.get("/customer/:id/edit",LoggedIn,  async (req, res) => {

try {

const id = req.params.id

const person = await Musteri.findByPk(id,{
include:[
{
model: Banka,
as: "bankalar"
},

{
model: Bankas,
as: "bankalars"
}
]
})

if(!person){
return res.status(404).send("Müşteri bulunamadı")
}

res.render("./admin/customer_details",{
title:"Yönetim Paneli",
person
})

}catch(err){
console.error(err)
res.status(500).send("Sunucu hatası")
}

})

router.get("/customer/:id/process", LoggedIn, async (req, res) => {

try {

const id = req.params.id

const person = await Musteri.findByPk(id,{
include:[
{
model: Banka,
as: "bankalar"
},

{
model: Bankas,
as: "bankalars"
}
]
})

if(!person){
return res.status(404).send("Müşteri bulunamadı")
}

res.render("./admin/customer_process",{
title:"Yönetim Paneli",
person
})

}catch(err){
console.error(err)
res.status(500).send("Sunucu hatası")
}

})
router.get("/customersearch", LoggedIn,(req,res)=>{
    res.render("./admin/customer_search",{title:"Yönetim Paneli"});
});



router.post("/customer/search", LoggedIn, async (req,res)=>{

try{

const q = req.body.query

if(!q) return res.send("Arama boş")

const customers = await Musteri.findAll({

where:{
[Op.or]:[
{ tc:{ [Op.like]:`%${q}%` } },
{ adSoyad:{ [Op.like]:`%${q}%` } },
{ telefon:{ [Op.like]:`%${q}%` } }
]
}

})

if(customers.length === 0){
return res.send("Müşteri bulunamadı")
}

if(customers.length === 1){
return res.redirect("/admin/customer/"+customers[0].id)
}

// customers list sayfasına render
res.render("admin/customers", { customers })

}catch(err){
console.error(err)
res.status(500).send("Sunucu hatası")
}

})


router.get("/customeradd",LoggedIn, (req,res)=>{
    res.render("./admin/customer_add",{title:"Yönetim Paneli"});
});



// Müşteri Onayla (Kabul Et)
router.post("/customer/:id/approve",LoggedIn, async (req, res) => {
    try {
        const id = req.params.id
        const person = await Musteri.findByPk(id)

        if(!person){
            return res.status(404).send("Müşteri bulunamadı")
        }

        person.AcoountStatus = "Active"   // Kabul ederse Active olacak
        await person.save()

        res.redirect("/admin/customers")  // yönlendirme
    } catch(err){
        console.error(err)
        res.status(500).send("Sunucu hatası")
    }
})

// Müşteri Reddet
router.post("/customer/:id/reject", LoggedIn, async (req, res) => {
    try {
        const id = req.params.id
        const person = await Musteri.findByPk(id)

        if(!person){
            return res.status(404).send("Müşteri bulunamadı")
        }

        person.AcoountStatus = "Disable"  // Reddederse Disable olacak
        await person.save()

        res.redirect("/admin/customers")
    } catch(err){
        console.error(err)
        res.status(500).send("Sunucu hatası")
    }
})



//Giriş İşlemlemleri

router.get("/dashboard", LoggedIn, (req,res)=>{
    const user = req.session.user

    res.render("./admin/Dashboard",{title:"Yönetim Paneli", user});
});



router.get("/customer/:id/dailyCode",LoggedIn, async (req,res)=>{
    try{

        const id = req.params.id
        const data = req.body

        const musteri = await Musteri.findByPk(id)
        if(!musteri) return res.status(404).send("Müşteri bulunamadı")

        musteri.DailyCode = await generateDailyCode(Musteri)

        await musteri.save()

        res.redirect("/admin/customer/"+id)

    }catch(err){
        console.error(err)
        res.status(500).send("Sunucu hatası")
    }
})

////------------------------------------------------------------------
////------------------------------------------------------------------
////------------------------------------------------------------------
////------------------------------------------------------------------
////------------------------------------------------------------------
////------------------------------------------------------------------
async function generateDailyCode(Musteri){

let code
let exists = true

while(exists){

const numbers = "0123456789"
code = ""

for(let i=0;i<6;i++){
code += numbers[Math.floor(Math.random()*numbers.length)]
}

const today = new Date()
const date =
today.getFullYear().toString() +
String(today.getMonth()+1).padStart(2,"0") +
String(today.getDate()).padStart(2,"0")

const fullCode = code + "-" + date

const kontrol = await Musteri.findOne({ where:{ DailyCode: fullCode } })

if(!kontrol){
exists = false
return fullCode
}

}

}

router.post("/customeradds",
LoggedIn,
upload.fields([
{ name:"ikametgahBelgesi",maxCount:1 },
{ name:"kimlikOnFoto",maxCount:1 },
{ name:"kimlikArkaFoto",maxCount:1 },
{ name:"yuzFoto",maxCount:1 }
]),

async(req,res)=>{

try{

const body = req.body
const dailyCode = await generateDailyCode(Musteri)

const musteri = await Musteri.create({

adSoyad: body.adSoyad,
email: body.email,
telefon: body.telefon,
tc: body.tc,

yetkili: body.yetkili,
bankaAcmaSebebi: body.bankaAcmaSebebi,

AcoountStatus: "Waiting",
DailyCode: dailyCode, // 123456-<tarih>
il: body.il,
ilce: body.ilce,
mahalle: body.mahalle,
netadres: body.netadres,

ikametgahBelgesi: req.files?.ikametgahBelgesi ? req.files.ikametgahBelgesi[0].filename : null,

kimlikOnFoto: req.files?.kimlikOnFoto ? req.files.kimlikOnFoto[0].filename : null,
not: "",
kimlikArkaFoto: req.files?.kimlikArkaFoto ? req.files.kimlikArkaFoto[0].filename : null,

yuzFoto: req.files?.yuzFoto ? req.files.yuzFoto[0].filename : null

})

res.json({
status:true,
message:"Müşteri eklendi",
data:musteri
})

}catch(err){

console.log(err)

res.status(500).json({
status:false,
message:"Sunucu hatası"
})

}

});

////


router.get("/login", (req,res)=>{
    res.render("./admin/admin_login",{title:"Yönetim Paneli"});
});


router.get("/registerr", (req,res)=>{
    res.render("./admin/admin_register",{title:"Yönetim Paneli"});
});



router.post("/register", async (req,res)=>{
const { tc,sifre,telefon,mudurMu,musteriEklemeYetkisi,musteriSilmeYetkisi,musteriGoruntulemeYetkisi } = req.body

const hash = await bcrypt.hash(sifre,10)

const user = await Yetkili.create({
tc,
sifre:hash,
telefon,
mudurMu: false,
musteriEklemeYetkisi: false,
musteriSilmeYetkisi: false,
musteriGoruntulemeYetkisi: true,
})

res.redirect("/")
})
router.get("/logout",(req,res)=>{

req.session.destroy((err)=>{
if(err){
return res.redirect("/admin/dashboard")
}

res.clearCookie("connect.sid")
res.redirect("/")
})

})
router.post("/login", async (req,res)=>{

try{

const { tc,sifre } = req.body

if(!tc || !sifre){
return res.redirect("/")
}

const bcrypt = require("bcrypt")

const user = await Yetkili.findOne({ where:{ tc } })

if(!user){
return res.redirect("/")
}

const kontrol = await bcrypt.compare(sifre,user.sifre)

if(!kontrol){
return res.redirect("/")
}

req.session.user = {
id:user.id,
tc:user.tc,
telefon:user.telefon,
mudur:user.mudurMu,
musteriEkle:user.musteriEklemeYetkisi,
musteriSil:user.musteriSilmeYetkisi,
musteriGor:user.musteriGoruntulemeYetkisi
}

res.redirect("/admin/dashboard")

}catch(err){

console.log(err)
res.redirect("/")

}

})




module.exports = router; 
