# node-wiktionary-translation
Library for Wiktionary word translation

## General notes

Wiktionary.org is a difficult platform to use programmatically as each language has a template of its own (some share a template, but the variation is unbelievably large).

As it currently stands, this library can get word translations without further explanations. The following languages are supported:

* Chinese (https://zh.wiktionary.org/)
* Dutch (https://nl.wiktionary.org/)
* English (https://en.wiktionary.org/)
* Finnish (https://fi.wiktionary.org/)
* French (https://fr.wiktionary.org/)
* German (https://de.wiktionary.org/)
* Italian (https://it.wiktionary.org/)
* Spanish (https://es.wiktionary.org/)
* Swedish (https://sv.wiktionary.org/)

## Usage

Example:

```javascript
var wiktionary = require('node-wiktionary-translation')();
// English terms for "Hafen" (German)
wiktionary.getDefinition('Hafen', 'de', 'en', function (terms, err) {
  // terms contains an array of "harbour", "port" and "haven"
});
```

An optional configuration object can be given as parameter. Currently only a logger can be given, e.g.:

```javascript
var myOwnLogger = ...;
var wiktionary = require('node-wiktionary-translation')({
  logger: myOwnLogger
});
```

## License

MIT

