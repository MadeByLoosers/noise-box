var casper = require('casper').create(),
  roomName = 'caspersroom',
  audiofile = '',
  port = casper.cli.get('port');

casper.echo("Casper started, using port " + port);

casper.start('http://localhost:'+ port +'/', function() {
    this.test.assertTitle('NoiseBox', 'NoiseBox title is ok');
    this.test.assertExists('form[action="/host/"]', 'The form to create a new host exists');
    this.fill('form[action="/host/"]', {
        id: roomName
    }, true);
});

casper.then(function() {
    this.test.assertUrlMatch('/host/caspersroom', 'You can create a new host');
    this.test.assertTextExists('Hosting "'+roomName+'"', 'The host exists after being created');
});

// casper.thenOpen('http://localhost:'+ port +'/caspersroom', function() {
//     this.test.assertUrlMatch(':'+ port +'/caspersroom', 'The client room exists');
//     this.test.assertTextExists('Viewing "'+roomName+'"', 'The client room identifies itself');
//     this.test.assertExists('a[href$=".mp3"]', 'An anchor element links to an mp3');
// });

// casper.thenClick('a[href$=".mp3"]', function() {
//     this.test.assertUrlMatch(':'+ port +'/caspersroom', 'Clicking the anchor does not change the page');
// });

// casper.thenOpen('http://localhost:'+ port +'/host/caspersroom', function() {
//     this.test.assertExists('audio[src$=".mp3"]', 'The host has an audio element pointing to an mp3');
// });

casper.then(function(){
    this.open('http://localhost:'+ port +'/testing/killme/');
    this.test.assert('a' === 'a', 'Visited url to kill app');
});

casper.run(function() {
    this.test.done(5); // checks that all assertions have been executed
    this.test.renderResults(true);
});