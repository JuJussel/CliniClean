const mongoose = require("./db.mongo");
const Schema = mongoose.Schema;

const FileSchema = new Schema(
    {
        extension: { type: String, required: true },
        size: Number,
        type: { type: String, required: true },
        meta: {},
        date: { type: Date, default: Date.now() },
    },
    {
        strict: false,
        toJSON: { virtuals: true }
    }
);

module.exports = mongoose.model("pub_files", FileSchema);
