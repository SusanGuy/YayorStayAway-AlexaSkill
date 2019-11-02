let express = require("express");
let process = require("./config.js");

let cookieParser = require("cookie-parser");

let indexRouter = require("./routes/index");
let mongoose = require("mongoose");
mongoose.connect(process.mongo.uri, {
    useNewUrlParser: true,
    useCreateIndex: true
});
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("Mongo DB connected succesfully");
});
let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);

const port = 5000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));