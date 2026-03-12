const multer = require("multer")
const path = require("path")
const fs = require("fs")

const storage = multer.diskStorage({

destination: (req,file,cb)=>{

const tc = req.body.tc

const uploadPath = path.join(__dirname,"../public/uploads",tc)

if(!fs.existsSync(uploadPath)){
fs.mkdirSync(uploadPath,{recursive:true})
}

cb(null,uploadPath)

},

filename:(req,file,cb)=>{

const ext = path.extname(file.originalname)

const fileName = file.fieldname + "-" + Date.now() + ext

cb(null,fileName)

}

})

const upload = multer({
storage:storage,
limits:{
fileSize:5 * 1024 * 1024
}
})

module.exports = upload