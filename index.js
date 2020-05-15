const readline = require('readline-sync')

function start(){
    const conteudo = {}

    conteudo.buscarTermo = askAndReturnSearchTerm();
    conteudo.buscarTermo = askAndReturnPrefix();
    
    function askAndReturnSearchTerm(){
        return readline.question('Digite o termo a ser buscado no Wikipedia:    ');
    }

    function askAndReturnPrefix(){
        const prefixes = ['Who is', 'What is', 'The history of'];
        const selectedPrefixIndex = readline.keyInSelect(prefixes,'Escolha uma opcao');
        const selectedPrefixText = prefixes[selectedPrefixIndex];
        return selectedPrefixText;
    }



    console.log(conteudo);
}

start();