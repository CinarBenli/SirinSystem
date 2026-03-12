const express = require("express")
const router = express.Router()
const { Musteri, Banka, Bankas } = require("../models")

router.get("/register", (req,res)=>{
    res.render("./customer/register", { title:"Yönetim Paneli" })
})

router.get("/login", (req,res)=>{
    res.render("./customer/login", { title:"Yönetim Paneli" })
})


router.get("/logout", (req,res)=>{
    req.session.destroy(err=>{
        if(err) console.error("Logout hatası:", err)
        res.redirect("/")
    })
})

router.get("/dashboard", async (req, res) => {

    if(!req.session.customer) return res.redirect("/customer/login")

    try {
        const id = req.session.customer.id
        const person = await Musteri.findByPk(id, {
            include: [
                { model: Banka, as: "bankalar" },
                { model: Bankas, as: "bankalars" }
            ]
        })

        if(!person){
            return res.status(404).send("Müşteri bulunamadı")
        }

        res.render("./customer/customer_detail", {
            title:"Yönetim Paneli",
            person
        })

    } catch(err){
        console.error(err)
        res.status(500).send("Sunucu hatası")
    }

})

router.post("/login", async (req,res)=>{
    const { tc, kod } = req.body
    if(!tc || !kod) return res.redirect("/customer/login")

    const user = await Musteri.findOne({ where:{ tc } })
    if(!user) return res.redirect("/customer/login")

    const today = new Date()
    const dateStr = today.getFullYear().toString() +
                    String(today.getMonth()+1).padStart(2,"0") +
                    String(today.getDate()).padStart(2,"0")

    const fullCode = kod.trim() + "-" + dateStr

    if(fullCode !== user.DailyCode){
        return res.redirect("/customer/login")  
    }

    req.session.customer = {
        id: user.id,
        tc: user.tc,
        isim: user.isim
    }

    res.redirect("/customer/dashboard")
})

module.exports = router