# landuse-geocoder
Returns info about territory using OSM data

## Import data
### Download OSM data shapefiles
    http://download.geofabrik.de/

### Import shapefiles into postgre database using gdal

    ogr2ogr -progress -append -update -skipfailures -nlt MULTIPOLYGON -f 'PostgreSQL' PG:"host=db user=root password=qwerty dbname=root" -nln public.landuse  data/gis_osm_landuse_a_free_1.shp

## API
### Get landuse info
    /landuse?lat=<lat>&lng=<lng>

#### Answer
    {
        "result": {
            "class": "farmland",
            "name": null
        },
        "items": [
            {
                "fclass": "farmland",
                "name": null,
                "area": "3672278.96"
            }
        ]
    }