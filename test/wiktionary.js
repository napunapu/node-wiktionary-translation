/**
 * ./node_modules/.bin/mocha -u tdd test/wiktionary.js
 */

var should = require('should');
var bunyan = require('bunyan');
process.env.NODE_ENV = 'test';
var wiktionary = require('../index')();

describe('Wiktionary tests', function () {
  this.slow(2000);
  this.timeout(15000);

  it('should get Finnish terms for "bear" (en)', function (done) {
    wiktionary.getDefinition('bear', 'en', 'fi', function (terms, err) {
      terms.should.have.length(24);
      terms[0].should.equal('karhu');
      terms[1].should.equal('metsäläinen');
      terms[2].should.equal('lasku');
      done();
    });
  });

  it('should get Finnish terms for "don\'t" (en)', function (done) {
    wiktionary.getDefinition('don\'t', 'en', 'fi', function (terms, err) {
      terms.should.have.length(2);
      terms[0].should.equal('älä');
      terms[1].should.equal('älkää');
      done();
    });
  });

  it('should get Finnish terms for "harbour" (en)', function (done) {
    wiktionary.getDefinition('harbour', 'en', 'fi', function (terms, err) {
      terms.should.have.length(5);
      terms[0].should.equal('turvapaikka');
      terms[1].should.equal('turvasatama');
      terms[2].should.equal('satama');
      terms[3].should.equal('suojella');
      terms[4].should.equal('tarjota suojapaikka');
      done();
    });
  });

  it('should get Finnish terms for "Harbour" (en)', function (done) {
    wiktionary.getDefinition('Harbour', 'en', 'fi', function (terms, err) {
      terms.should.have.length(5);
      terms[0].should.equal('turvapaikka');
      terms[1].should.equal('turvasatama');
      terms[2].should.equal('satama');
      terms[3].should.equal('suojella');
      terms[4].should.equal('tarjota suojapaikka');
      done();
    });
  });

  it('should get Finnish terms for "harbor" (en)', function (done) {
    wiktionary.getDefinition('harbor', 'en', 'fi', function (terms, err) {
      terms.should.have.length(3);
      terms[0].should.equal('suojella');
      terms[1].should.equal('antaa suojapaikka');
      terms[2].should.equal('hautoa mielessään');
      done();
    });
  });

  it('should get a Finnish terms for "breach" (en)', function (done) {
    wiktionary.getDefinition('breach', 'en', 'fi', function (terms, err) {
      terms.should.have.length(11);
      terms[0].should.equal('murros');
      terms[1].should.equal('rikkomus');
      terms[2].should.equal('rikkominen');
      done();
    });
  });

  it('should get no Italian terms for "harbor" (en)', function (done) {
    wiktionary.getDefinition('harbor', 'en', 'it', function (terms, err) {
      should.equal(terms, null);
      done();
    });
  });

  it('should get a Dutch term for "satama" (fi)', function (done) {
    wiktionary.getDefinition('satama', 'fi', 'nl', function (terms, err) {
      terms.should.have.length(1);
      terms[0].should.equal('haven');
      done();
    });
  });

  it('should get a Finnish term for "Hafen" (de)', function (done) {
    wiktionary.getDefinition('Hafen', 'de', 'fi', function (terms, err) {
      terms.should.have.length(1);
      terms[0].should.equal('satama');
      done();
    });
  });

  it('should get English terms for "Hafen" (de)', function (done) {
    wiktionary.getDefinition('Hafen', 'de', 'en', function (terms, err) {
      terms.should.have.length(3);
      terms[0].should.equal('harbour');
      terms[1].should.equal('port');
      terms[2].should.equal('haven');
      done();
    });
  });

  it('should get English terms for "hamn" (sv)', function (done) {
    wiktionary.getDefinition('hamn', 'sv', 'en', function (terms, err) {
      terms.should.have.length(2);
      terms[0].should.equal('port');
      terms[1].should.equal('haven');
      done();
    });
  });

  it('should get a German term for "hamn" (sv)', function (done) {
    wiktionary.getDefinition('hamn', 'sv', 'de', function (terms, err) {
      terms.should.have.length(1);
      terms[0].should.equal('Hafen');
      done();
    });
  });

  it('should get a German term for "perro" (es)', function (done) {
    wiktionary.getDefinition('perro', 'es', 'de', function (terms, err) {
      terms.should.have.length(1);
      terms[0].should.equal('Hund');
      done();
    });
  });

  it('should get English terms for "perro" (es)', function (done) {
    wiktionary.getDefinition('perro', 'es', 'en', function (terms, err) {
      terms.should.have.length(2);
      terms[0].should.equal('dog');
      terms[1].should.equal('aligator clip');
      done();
    });
  });

  it('should get a German term for "hond" (nl)', function (done) {
    wiktionary.getDefinition('hond', 'nl', 'de', function (terms, err) {
      terms.should.have.length(1);
      terms[0].should.equal('Hund');
      done();
    });
  });

  it('should get English terms for "haven" (nl)', function (done) {
    wiktionary.getDefinition('haven', 'nl', 'en', function (terms, err) {
      terms.should.have.length(3);
      terms[0].should.equal('port');
      terms[1].should.equal('harbor');
      terms[2].should.equal('harbour');
      done();
    });
  });

  it('should get a German term for "cane" (it)', function (done) {
    wiktionary.getDefinition('cane', 'it', 'de', function (terms, err) {
      terms.should.have.length(1);
      terms[0].should.equal('Hund');
      done();
    });
  });

  it('should get English terms for "porto" (it)', function (done) {
    wiktionary.getDefinition('porto', 'it', 'en', function (terms, err) {
      terms.should.have.length(5);
      terms[0].should.equal('port');
      terms[1].should.equal('harbour');
      terms[2].should.equal('transport');
      terms[3].should.equal('carriage');
      terms[4].should.equal('conveyance');
      done();
    });
  });

  it('should get a German term for "chien" (fr)', function (done) {
    wiktionary.getDefinition('chien', 'fr', 'de', function (terms, err) {
      terms.should.have.length(1);
      terms[0].should.equal('Hund');
      done();
    });
  });

  it('should get English terms for "havre" (fr)', function (done) {
    wiktionary.getDefinition('havre', 'fr', 'en', function (terms, err) {
      terms.should.have.length(2);
      terms[0].should.equal('haven');
      terms[1].should.equal('harbour');
      done();
    });
  });

  it('should get an English term for "狗" (zh)', function (done) {
    wiktionary.getDefinition('狗', 'zh', 'en', function (terms, err) {
      terms.should.have.length(1);
      terms[0].should.equal('dog');
      done();
    });
  });

  it('should get English terms for "市" (zh)', function (done) {
    wiktionary.getDefinition('市', 'zh', 'en', function (terms, err) {
      terms.should.have.length(3);
      terms[0].should.equal('market, fair');
      terms[1].should.equal('city, town');
      terms[2].should.equal('trade');
      done();
    });
  });

  it('should get German terms for "国家" (zh)', function (done) {
    wiktionary.getDefinition('国家', 'zh', 'de', function (terms, err) {
      terms.should.have.length(3);
      terms[0].should.equal('Land 中');
      terms[1].should.equal('Staat 阳');
      terms[2].should.equal('Vaterland 中');
      done();
    });
  });
});
