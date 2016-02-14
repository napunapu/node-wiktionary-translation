var request      = require('request');
var bunyan       = require('bunyan');
var bunyanFormat = require('bunyan-format');

/**
*
* For usage example see test/wiktionary.js
*
* Examples of requests made to Wiktionary:
* https://en.wiktionary.org/w/api.php?format=json&action=query&rvprop=content&prop=revisions&redirects=1&titles=harbour
* https://fi.wiktionary.org/w/api.php?format=json&action=query&rvprop=content&prop=revisions&redirects=1&titles=satama
* https://de.wiktionary.org/w/api.php?format=json&action=query&rvprop=content&prop=revisions&redirects=1&titles=Hafen
* https://sv.wiktionary.org/w/api.php?format=json&action=query&rvprop=content&prop=revisions&redirects=1&titles=hamn
* https://es.wiktionary.org/w/api.php?format=json&action=query&rvprop=content&prop=revisions&redirects=1&titles=perro
* https://nl.wiktionary.org/w/api.php?format=json&action=query&rvprop=content&prop=revisions&redirects=1&titles=haven
* https://it.wiktionary.org/w/api.php?format=json&action=query&rvprop=content&prop=revisions&redirects=1&titles=porto
* https://fr.wiktionary.org/w/api.php?format=json&action=query&rvprop=content&prop=revisions&redirects=1&titles=chien
* https://zh.wiktionary.org/w/api.php?format=json&action=query&rvprop=content&prop=revisions&redirects=1&titles=市
*
*/

module.exports = function (moduleOptions) {

  return {
    // Parameter function 'done' should have two parameters: an array of returned terms and an error object
    getDefinition: function (word, fromLang, toLang, done) {
      var logger;
      if (moduleOptions && moduleOptions.logger) {
        logger = moduleOptions.logger;
      } else {
        logger = bunyan.createLogger({
          name: 'wiktionary',
          streams: [
            {
              level: 'info',
              stream: bunyanFormat({ outputMode: 'simple' })
            }
          ]
        });
      }
      var options = {
        url: 'https://' + fromLang +
          '.wiktionary.org/w/api.php?format=json&action=query&rvprop=content&prop=revisions&redirects=1&titles=' +
          encodeURIComponent(word)
      }
      request.get(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          var pages = JSON.parse(body).query.pages;
          for (var pageId in pages) {
            if (!pages[pageId].revisions) {
              continue;
            }
            var rawAnswer = pages[pageId].revisions[0]['*'];
            var search = '';
            if (fromLang === 'de' || fromLang === 'it') {
              search = '{{' + toLang + '}}:';
            } else if (fromLang === 'nl') {
              search = '*{{' + toLangAsWord(fromLang, toLang) + '}}:';
            } else if (fromLang === 'fr') {
              search = '|' + toLang + '}}';
            } else if (fromLang === 'es') {
              search = '|' + toLang + '|';
            } else if (fromLang === 'zh') {
              search = '*' + toLangAsWord(fromLang, toLang) + '\uff1a';
            } else {
              search = toLangAsWord(fromLang, toLang) + ': ';
            }
            var texts = rawAnswer.split(search);
            var cleanedTerms = new Set();
            for (var i = 1; i < texts.length; i++) {
              var text = texts[i];
              // get only this language's definitions
              text = text.substring(0, text.indexOf('\n'));
              var originalTerms = [];
              if (fromLang === 'de') {
                originalTerms = text.split('{{');
                originalTerms.splice(0, 1);
              } else if (fromLang === 'it') {
                originalTerms = text.split(']], [[');
              } else if (fromLang === 'nl') {
                originalTerms = text.split('}}, {{');
              } else if (fromLang === 'fr') {
                text = text.split(' (')[0];
                originalTerms = text.split('}}, {{');
              } else if (fromLang === 'es') {
                originalTerms = text.split('|,|');
              } else if (fromLang === 'zh') {
                originalTerms = text.split(';');
              } else {
                originalTerms = text.split('}},');
              }
              for (var j = 0; j < originalTerms.length; j++) {
                var term = originalTerms[j].trim();
                if (fromLang === 'de' || fromLang === 'nl' || fromLang === 'fr') {
                  term = term.split('}}')[0];
                  term = term.split('|')[2];
                } else if (fromLang === 'it') {
                  term = term.split(']]')[0];
                  if (term.indexOf('[[') > -1){
                    term = term.split('[[')[1];
                  }
                }  else if (fromLang === 'es') {
                  term = term.split('}}')[0];
                  term = term.split('|')[1];
                } else {
                  if (term.indexOf('[') === -1) {
                    if (term.indexOf('|') !== -1) {
                      // e.g. {{qualifier|promise}} {{t+|fi|rikkominen}}
                      if (term.indexOf('}} {{') !== -1) {
                        term = term.split('}} ')[1];
                      }
                      term = term.split('|')[2].replace('}}', '');
                    }
                  } else {
                    // e.g. [[hautoa]] [[mieless\u00e4]][[-\u00e4n|\u00e4n]]
                    term = term.split('|')[0];
                    term = term.replace('[[-', '');
                    // replace other brackets
                    term = replaceAll(term, '[[', '');
                    term = replaceAll(term, ']]', '');
                    if (term.indexOf(' {') > -1) {
                      term = term.split(' {')[0];
                    }
                  }
                }
                cleanedTerms.add(term);
              }
            }
            break;
          }
          if (cleanedTerms && cleanedTerms.size) {
            done(Array.from(cleanedTerms));
          } else {
            done(null);
          }
        } else {
          logger.error('error in getting word from Wiktionary', error);
          done(null, error);
        }
      });
    }
  };

  // from http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript
  function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
  }

  function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }

  function toLangAsWord(fromLang, toLang) {
    var languages = {
      'de': {
        'de': 'Deutsch',
        'en': 'Englisch',
        'es': 'Spanisch',
        'fi': 'Finnisch',
        'fr': 'Französisch',
        'it': 'Italienisch',
        'nl': 'Niederländisch',
        'sv': 'Schwedisch',
        'zh': 'Chinesisch'
      },
      'en': {
        'de': 'German',
        'en': 'English',
        'es': 'Spanish',
        'fi': 'Finnish',
        'fr': 'French',
        'it': 'Italian',
        'nl': 'Dutch',
        'sv': 'Swedish',
        'zh': 'Chinese'
      },
      'es': {
        'de': 'alemán',
        'en': 'inglés',
        'es': 'español',
        'fi': 'finés',
        'fr': 'francés',
        'it': 'italiano',
        'nl': 'neerlandés',
        'sv': 'sueco',
        'zh': 'chino'
      },
      'fi': {
        'de': 'saksa',
        'en': 'englanti',
        'es': 'espanja',
        'fi': 'suomi',
        'fr': 'ranska',
        'it': 'italia',
        'nl': 'hollanti',
        'sv': 'ruotsi',
        'zh': 'kiina'
      },
      'fr': {
        'de': 'allemand',
        'en': 'anglais',
        'es': 'espagnol',
        'fi': 'finnois',
        'fr': 'français',
        'it': 'italien',
        'nl': 'néerlandais',
        'sv': 'suédois',
        'zh': 'chinois'
      },
      'it': {
        'de': 'tedesco',
        'en': 'inglese',
        'es': 'spagnolo',
        'fi': 'finlandese',
        'fr': 'francese',
        'it': 'italiano',
        'nl': 'olandese',
        'sv': 'svedese',
        'zh': 'cinese'
      },
      'nl': {
        'de': 'deu',
        'en': 'eng',
        'es': 'spa',
        'fi': 'fin',
        'fr': 'fra',
        'it': 'ita',
        'nl': 'nds',
        'sv': 'swe',
        'zh': 'zho'
      },
      'sv': {
        'de': 'tyska',
        'en': 'engelska',
        'es': 'spanska',
        'fi': 'finska',
        'fr': 'franska',
        'it': 'italienska',
        'nl': 'nederländska',
        'sv': 'svenska',
        'zh': 'kinesiska'
      },
      'zh': {
        'de': '德语',
        'en': '英语',
        'es': '西班牙语',
        'fi': '芬兰语',
        'fr': '法语',
        'it': '意大利语',
        'nl': '荷兰语',
        'sv': '瑞典语',
        'zh': '中语'
      }
    };
    return languages[fromLang][toLang];
  }
};
