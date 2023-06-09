const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

require('dotenv').config()

const HttpError = require('./utils/http-error')

mongoose.set('strictQuery', true)
var corsOptions = {
    origin: '*',
   }

const app = express()
app.use(bodyParser.json())
app.use(cors(corsOptions))

const musiquesRoutes = require('./routes/musiques-routes')
const filmsRoutes = require('./routes/films-routes')

app.use('/api/musiques', musiquesRoutes);
app.use('/api/films', filmsRoutes)

app.use((req, res, next) => {
    const error = new HttpError('Page non trouvée', 404)
    return next(error)
})

app.use((error, req, res, next) => {
    if(res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'Une erreur non gérée est survenue'})
}, )

// const uri = 'mongodb+srv://gretaUser:bCx1m4K49VIpKttf@gretalaurent.sdfgski.mongodb.net/Bibliotheque?retryWrites=true&w=majority'
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@${process.env.DB_SERVER}/${process.env.DB_NAME}?retryWrites=true&w=majority`


mongoose.connect(uri)
    .then(() => {
        app.listen(process.env.PORT || 5000);
        console.log("Server running");
    })
    .catch(err => {
        console.log(err);
    })

