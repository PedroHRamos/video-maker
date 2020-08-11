const readline = require('readline-sync');
const state = require('./state.js');

function robot(){
    //Processamento
    const content = {
        maximumContent: 7
    }

    content.searchTerm = askAndReturnSearchTerm();
    content.prefix = askAndReturnPrefix();
    state.save(content);

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
}

module.exports = robot