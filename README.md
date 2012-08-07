noise-box
=========

Allow anyone to start their own noise box 'room', with one 'host' that'll play the noise, and then lots of clients that can select tracks, which will then be played via their specific host.

The first time anyone comes to the site they'll see two forms, one to start a room, the other to join a room. Both just require a name for the room, and a password. When you start a room you give it a name and pw, then that machine becomes the host (that the sound clips will play through). If you want to join a room you need to know the shared name and pw.

Once a client logs in to the room, they see a list of tracks, can preview or broadcast a clip, that'll then get queued and played on the host machine. The noise will be played via the html5 audio api.


Future versions
---------------

For this version it'll just offer preset sfx clips, but v2 will allow people to upload their own tracks.


Scratchpad
----------

 - on home page, have one button to create a room that creates a base-64 URL
 - and/or allow people to visit any URL, if that room doesn't currently exist, allow them to create one?


Articles
--------

 * http://www.hacksparrow.com/express-js-tutorial.html
 * http://www.hacksparrow.com/handle-file-uploads-in-express-node-js.html
 * http://stackoverflow.com/questions/5778245/expressjs-how-to-structure-an-application
 * http://expressjs.com/api.html
