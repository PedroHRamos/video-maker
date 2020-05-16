const algorithmia = require('algorithmia');
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey;
const sentenceBoundaryDetection = require('sbd') ;

async function robot(content){
    
    //Métodos
    async function fetchContentFromWikipedia(content){
        try{
            const algorithmiaAutenticated = algorithmia(algorithmiaApiKey);
            const wikipediaAlgorithm = algorithmiaAutenticated.algo("web/WikipediaParser/0.1.2?timeout=300");
            const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm);
            const wikipediaContent = wikipediaResponse.get();
            content.sourceContentOriginal = wikipediaContent.content;
        }catch(ex){
            console.log('erou');
        }
    }

    function sanitizeContent(content){

        function removeBlankLines(text){
            const allLines = text.split('\n');
            const stringComFiltro = allLines.filter((line) => {
                if(line.trim().length == 0){
                    return false
                }
                return true
            })
            return stringComFiltro;
        }

        function removeMarkDown(text){
            const stringComFiltro = text.filter((line) => {
                if(line.trim().startsWith('=') ){
                    return false
                }
                return true
            })
            return stringComFiltro;
        }

        function removeDatesInParentheses(text) {
            const textoformatado = text.toString().replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ');
            return textoformatado;
        }

        const withoutBlankLines = removeBlankLines(content.sourceContentOriginal);
        const withoutMarkDown = removeMarkDown(withoutBlankLines);
        const withoutDateAndSpecialText = removeDatesInParentheses(withoutMarkDown);
        content.sourceContentSanetized = withoutDateAndSpecialText;
        //console.log(withoutDateAndSpecialText);
    
    }

    function breakContentIntoSentences(content){

        content.sentences = []
        const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanetized);
        
        sentences.forEach(sentence => {
            content.sentences.push({
                text: sentence,
                keyWords: [],
                images: []
            })
        })

    }

    //Processamento
    await fetchContentFromWikipedia(content);
    sanitizeContent(content);
    breakContentIntoSentences(content);

}

module.exports = robot;