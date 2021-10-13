
const axios = require('axios');

class Busquedas{
    historial = ['Temuco'];

    constructor(){

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
        this.historial.unshift(lugar);
    }
    
}


module.exports = Busquedas;