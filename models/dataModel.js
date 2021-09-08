module.exports = (mongoose) => {
    const schema = mongoose.Schema(
        {
        daerah: String,
        positif: String,
        sembuh: String,
        meninggal: String,
        dirawat: String,
        log_sebelumnya: Array
        },
        { timestamps: true }
    )
    // mengubah _id menjadi id
    schema.method("toJSON", function() {
        const {__v, _id, ...object} = this.toObject()
        object.id = _id
        return object
    })

    const Data = mongoose.model("data", schema)
    return Data
}