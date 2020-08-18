const robots = {
    input: require('./robots/input.js'),
    text: require('./robots/text.js'),
    state: require('./robots/state.js'),
    image: require('./robots/image.js')
}

async function start(){

    try{
        robots.input()
        await robots.text();
        await robots.image();

        //const content = robots.state.load();
        //console.dir(content,{deph: null});
    }catch(e){
        console.log(e)
    }
}

start();