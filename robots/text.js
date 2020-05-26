const algorithmia = require('algorithmia');
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey;
const sentenceBoundaryDetection = require('sbd') ;
const fs = require('fs');
const watsonApiKey = require('../credentials/watson-nlu.json').apikey;
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
 
var nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey: watsonApiKey,
  version: '2018-04-05',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
});

async function fetchWatsonAndReturnKeywords(sentence) {
    return new Promise((resolve, reject) => {
      nlu.analyze({
        text: sentence,
        features: {
          keywords: {}
        }
      }, (error, response) => {
        if (error) {
          throw error          
        }
        // Essas keyword são apenas uma das possibilidades com o watson da IBM
        // Podemos também pegar a relevância das keywords
        // Ou emoção positiva ou negativa envolvida na frase
        // Futuramente esse ponto deverá evoluir para aumentar a qualidade dos resultados
        const keywords = response.keywords.map((keyword) => {
          return keyword.text
        })

        resolve(keywords)
      })
    })
  }

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
                keywords: [],
                images: []
            })
        })

    }

    function limitMaximumSentences(content){
        content.sentences = content.sentences.slice(0, content.maximumContent)
    }

    async function fetchKeywordsOfAllSentences(content){
        for(const sentence of content.sentences){
            sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text);
        }
    }

    //Processamento
    await fetchContentFromWikipedia(content);
    sanitizeContent(content);
    breakContentIntoSentences(content);
    limitMaximumSentences(content);
    await fetchKeywordsOfAllSentences(content);
        
}

module.exports = robot;