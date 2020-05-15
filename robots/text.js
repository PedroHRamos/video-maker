const algorithmia = require('algorithmia');
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey;

function robot(content){
    
    //Métodos
    async function fetchContentFromWikipedia(content){
        try{
            const algorithmiaAutenticated = algorithmia(algorithmiaApiKey);
            const wikipediaAlgorithm = algorithmiaAutenticated.algo("web/WikipediaParser/0.1.2?timeout=300");
            const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm);
            const wikipediaContent = wikipediaResponse.get();
            console.log(wikipediaContent);
        }catch(ex){
            console.log('erou');
        }
    }

    //Processamento
    fetchContentFromWikipedia(content);
    //sanitizeContent(content);
    //breakContentIntoSentences(content);

}

module.exports = robot;