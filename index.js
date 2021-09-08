const express = require('express')
const cron = require('node-cron')
const cors = require('cors')

const app = express()
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))



const db = require('./models/')
db.mongoose.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to database')
}).catch((err) => {
    console.log('Cannot connected to database', err)
    process.exit()
});


app.get('/', (req, res) => {
    res.json({
        message: "Success  fetch data from database"
    })
})
require('./routes/dataRoutes')(app)

const auto = require('./controllers/dataController')
cron.schedule('59 11 * * *', function() {
    auto.autoPostCron()
    console.log('Auto post cron job')
});

// listening port
const PORT = 8000
app.listen(PORT, () => {
console.log(`Server run at http://localhost:${PORT}`)
})