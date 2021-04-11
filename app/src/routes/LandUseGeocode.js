const Joi = require('joi')
const _get = require('lodash/get')
const ConnectionsManager = require.main.require('./src/ConnectionsManager')


const validationSchema = Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required()
})

module.exports = async (req, res) => {

    const validator = validationSchema.validate(req.query);

    if (validator.error) {
        res
            .status(400)
            .json({
                status: "error",
                message: validator.error.details.map(el => el.message).join('; ')
            })
    }

    try {
        const data = await ConnectionsManager.query(`
            SELECT
                fclass,
                name,
                ROUND(ST_Area(ST_Transform(wkb_geometry, 3395))::numeric, 2) as area
            FROM public.landuse
            WHERE 
                ST_MakePoint($1, $2, 4326) && wkb_geometry AND
                ST_Intersects(wkb_geometry, ST_SetSRID(ST_MakePoint($1, $2), 4326))
            ORDER BY ST_Area(wkb_geometry) ASC
       `, [
            parseFloat(req.query.lng),
            parseFloat(req.query.lat)
        ])

        let result = null
        if(data.rows) {
            result = {
                fclass: _get(data.rows, '0.fclass'),
                name: _get(data.rows, '0.name')
            }
        }

        res
            .status(200)
            .json({
                result: result,
                items: data.rows
            })
    } catch (error) {
        console.error(error)

        res
            .status(500)
            .json({
                status: "error",
                message: error.message
            })
    }
}

