#noise-box
=========

Allow anyone to start their own noise box 'room', with 'hosts' that'll play the noise, and 'clients' that can select tracks, which will then be played via their specific host(s).

Once a client logs in to the room, they see a list of tracks, can preview or broadcast a clip, that'll then get queued and played on the host machine. The noise will be played via the html5 audio api.

###Requirements
* Node v0.8+
* npm

###Installation
```
git clone git@github.com:GuntLondon/noise-box.git
cd noise-box/src
npm install
```

###Usage
Fire up the noise box server by switching to the ```src``` directory and running ```node server.js```

Browse to http://localhost:7001

Enjoy!