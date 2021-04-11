const Express = require('express')
const ConnectionsManager = require('./src/ConnectionsManager')
const LandUseGeocode = require('./src/routes/LandUseGeocode')

const app = Express()
const port = process.env.PORT || 3000

ConnectionsManager.setOptions({
    user: process.env.POSTGRES_USER || 'root',
    host: process.env.POSTGRES_HOST || 'localhost',
    password: process.env.POSTGRES_PASSWORD || 'qwerty',
    database: process.env.POSTGRES_DB || 'root',
    port: 5432
  })

app.get('/landuse', LandUseGeocode)

  app.use((err, req, res, next) => {
    res
      .status(500)
      .json({
        message: err.message
      })
  })

app.listen(port, () => {
    console.log(`Example app listening at ${port}`)
})