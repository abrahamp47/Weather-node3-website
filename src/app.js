const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

//Define paths for Express
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Abruham Pilip'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name : 'Abraham Philip'

    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text',
        title: 'Help',
        name: 'Abraham Philip'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'Address must be provided'
        })
    } else {
        geocode( req.query.address, (error, {longitude, latitude, location } = {}) =>{
        if(error){
            return res.send({ error })
        }
        forecast(latitude, longitude, (error, forecastData) =>{
            if(error)
            {
                return res.send(error)
            } else {
                res.send({
                    forecast: forecastData,
                    location,
                    address: req.query.address
                    })
                }
            })
        })
    }
})


app.get('/products', (req, res) => {
    if(!req.query.search) {
        return res.send({
            error: ' you must provvide a search term'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Help article not found',
        name: 'Abraham Philip'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage:  'Page not found',
        name: 'Abraham Philip'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})