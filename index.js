const readline = require('readline-sync')
const robots = {
    text: require('./robots/text.js')
}

async function start(){

    try{

        //Métodos
        function askAndReturnSearchTerm(){
            return readline.question('Digite o termo a ser buscado no Wikipedia:    ');
        }

        function askAndReturnPrefix(){
            const prefixes = ['Who is', 'What is', 'The history of'];
            const selectedPrefixIndex = readline.keyInSelect(prefixes,'Escolha uma opcao');
            const selectedPrefixText = prefixes[selectedPrefixIndex];
            return selectedPrefixText;
        }

        //Processamento
        const conteudo = {
            maximumContent: 7
        }

        conteudo.searchTerm = askAndReturnSearchTerm();
        conteudo.prefix = askAndReturnPrefix();

        await robots.text(conteudo);
        //console.log(conteudo);
        console.log(JSON.stringify(conteudo),null,2);

    }catch(e){
        console.log(e)
    }
    //console.log(JSON.stringify(conteudo),null,2);
}

start();