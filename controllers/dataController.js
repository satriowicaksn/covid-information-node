const db = require('../models')
const axios = require('axios')

const Data = db.data

function fetchAndPostFromApi(logHistory){
    let result = []
    axios.get('https://api.kawalcorona.com/indonesia/')
        .then((response) => {
            result = response.data 
            result.map((response) => {
                const newData = new Data({
                    daerah: response.name,
                    positif: response.positif,
                    sembuh: response.sembuh,
                    meninggal: response.meninggal,
                    dirawat: response.dirawat,
                    log_sebelumnya: logHistory
                })
                console.log(newData)
                newData.save(newData)
            })
        })
}

exports.findAll = (req, res) => {   
    Data.find()
    .then((result) => {
        res.send(result)
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Some error while retrieving data from database"
        })
    });
}


exports.findLast = (req, res) => {
    checkUpdate()
    Data.find().sort({$natural: -1}).limit(1)
    .then((result) => {
        res.send(result)
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Some error while retrieving data from database"
        })
    });
}

function checkUpdate(){
    let apiResult = []
    let dbResult = []
    const dbData = Data.find().sort({$natural: -1}).limit(1).then((result) => {
        if (result.length == 0) {
            fetchAndPostFromApi()
            return
       }
        dbResult = result
        const logHistory = {
            updatedAt: dbResult[0].updatedAt,
            positif: dbResult[0].positif,
            sembuh: dbResult[0].sembuh,
            meninggal: dbResult[0].meninggal,
            dirawat: dbResult[0].dirawat
        }
        axios.get('https://api.kawalcorona.com/indonesia/')
        .then((apiResponse) => {
            apiResult = apiResponse.data
            if (apiResult[0].positif != dbResult[0].positif){
                fetchAndPostFromApi(logHistory)
            }else if (apiResult[0].sembuh != dbResult[0].sembuh){
                fetchAndPostFromApi(logHistory)
            }else if (apiResult[0].meninggal != dbResult[0].meninggal){
                fetchAndPostFromApi(logHistory)
            }else if (apiResult[0].dirawat != dbResult[0].dirawat){
                fetchAndPostFromApi(logHistory)
            }
        })
    })
}

exports.autoPostCron = () => {
    let dbResult = []
    const dbData = Data.find().sort({$natural: -1}).limit(1).then((result) => {
        if (result.length == 0) {
            fetchAndPostFromApi()
            return
       }
        dbResult = result
        const logHistory = {
            updatedAt: dbResult[0].updatedAt,
            positif: dbResult[0].positif,
            sembuh: dbResult[0].sembuh,
            meninggal: dbResult[0].meninggal,
            dirawat: dbResult[0].dirawat
        }
        fetchAndPostFromApi(logHistory) 
    })
}
