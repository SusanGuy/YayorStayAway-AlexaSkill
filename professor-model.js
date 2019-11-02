const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const professorSchema = new Schema({
    _id: Number,
    name: String
});
const Professor = mongoose.model("Professor", professorSchema);
module.exports = Professor;