
const { leerInput, inquirerMenu, pausa, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');
require('dotenv').config();


const main = async() => {
    let opt;

    const busquedas = new Busquedas();

    do {
        opt = await inquirerMenu();
        //console.log({ opt });
        
        switch (opt) {
            case 1:
                
                const lugar = await leerInput('Ciudad a buscar:');
                //console.log(lugar);

                const lugares =  await busquedas.ciudad(lugar);
                //console.log(lugares);

                const id = await listarLugares(lugares);
                //console.log({ id });

                const lugarSel = lugares.find( l => l.id == id );
                //console.log(lugarSel);

                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);
                //console.log(clima);

                console.clear();
                console.log(`\nInformacion de la ciudad\n`.green);
                console.log(`Ciudad:`, lugarSel.nombre );
                console.log(`Lat:`,  lugarSel.lat);
                console.log(`Lng:`,  lugarSel.lng);
                console.log(`Minima:`, clima.min);
                console.log(`Maxima:`, clima.max);
                console.log(`========================`);
                console.log(`Temperatura Actual:`, clima.temp);
                console.log(`Cielo:`, clima.desc);
                break;
            
            case 2:

                break;

            default:
                break;
        }
        
        if ( opt !== 0 ) await pausa();

    } while ( opt !== 0);
}

main();



