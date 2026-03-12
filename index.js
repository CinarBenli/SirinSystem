const express = require("express");
const session = require("express-session")
const path = require("path");
const indexRouter = require("./routes/index");
const adminRouter = require("./routes/admin");
const customerRouter = require("./routes/customer");
const cookieParser = require("cookie-parser")

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(cookieParser())
app.use(session({
secret:"sirinbank_secret",
resave:false,
saveUninitialized:false
}))
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/admin", adminRouter);
app.use("/customer", customerRouter);

const port = 3000;
app.listen(port, () => {
    console.log(`Server çalışıyor: http://localhost:${port}`);
});