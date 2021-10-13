
const axios = require('axios');
const fs = require('fs');


class Busquedas{
    historial = [];
    dbPath = './db/database.json';

    constructor(){
        this.leerBD();
    }

    get historialCapitalizado(){

        return this.historial.map(lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map ( p => p[0].toUpperCase() + p.substring(1) );

            return palabras.join(' ');
        });
    }
    get paramsMapbox(){
        return {
                'access_token': process.env.MAPBOX_KEY,
                'limit': 5,
                'language':'es'

        }
    }
    
    get paramsWeather(){
        return {
            
                'appid': process.env.OPENWEATHER_KEY,
                'units': 'metric',
                'lang': 'es'
        }
    }
    

    async ciudad(lugar = ''){

        console.log(lugar);
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/santiago.json?access_token=pk.eyJ1Ijoic291amlyb3ZhbGsiLCJhIjoiY2t1cGwxY21uMzQ5NTJydDR3eHMwOWxncyJ9.RrNWidWLCUgQPKHDP6-Alg&cachebuster=1634134033181&autocomplete=true&limit=5&language=es`
        //const resp = await axios.get(url);
        const instance = axios.create({
            baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
            // params:{
            //     'access_token': 'pk.eyJ1Ijoic291amlyb3ZhbGsiLCJhIjoiY2t1cGwxY21uMzQ5NTJydDR3eHMwOWxncyJ9.RrNWidWLCUgQPKHDP6-Alg',
            //     'limit': 5,
            //     'language':'es'
            // }
            params: this.paramsMapbox
        });

        const resp = await instance.get();
        
        //console.log(resp.data);

        //console.log(resp.data.features);

        // devuelve arreglo de los datos que uno quiera
        return resp.data.features.map ( lugar =>({
            id: lugar.id,
            nombre: lugar.place_name,
            lng: lugar.center[0],
            lat: lugar.center[1]
        }));

    }

    async climaLugar (lat, lon){

        try {

            //api.openweathermap.org/data/2.5/weather?lat=-33.45&lon=-70.66667&appid=f369635965b00ad16ced5da4da4b9f3b&units=metric&lang=es

            const instanciaClima = axios.create({
                baseURL: `http://api.openweathermap.org/data/2.5/weather`,
                // params:{
                //     'appid': process.env.OPENWEATHER_KEY,
                //     'lat': lat,
                //     'lon': lon,
                //     'units': 'metric',
                //     'lang': 'es'
                // }
                params: {...this.paramsWeather, lat , lon }
            });
    
            const resp = await instanciaClima.get();
            //console.log('respuesta',resp.data);
            const { weather, main } = resp.data
            return {
                desc: weather[0].description ,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }

            
        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial( lugar = ''){

        // eliminar los duplicados
        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }

        // mantiene solo 6 en historial
        this.historial = this.historial.splice(0,5);

        this.historial.unshift(lugar.toLocaleLowerCase());
        this.guardarDB();
    }
    

    guardarDB(){
        const payload = {
            historial: this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerBD(){

        // valida si el archivo existe
        if ( !fs.existsSync(this.dbPath ) ) return;

        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8'  } );

        const data = JSON.parse( info);

        this.historial= data.historial;

    }
}


module.exports = Busquedas;