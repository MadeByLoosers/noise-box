noise-box
=========

Allow anyone to start their own noise box 'room', with one 'host' that'll play the noise, and then lots of clients that can select tracks, which will then be played via their specific host.

The first time anyone comes to the site they'll see two forms, one to start a room, the other to join a room. Both just require a name for the room, and a password. When you start a room you give it a name and pw, then that machine becomes the host (that the sound clips will play through). If you want to join a room you need to know the shared name and pw.

Once a client logs in to the room, they see a list of tracks, can preview or broadcast a clip, that'll then get queued and played on the host machine. The noise will be played via the html5 audio api.


Future versions
---------------

For this version it'll just offer preset sfx clips, but v2 will allow people to upload their own tracks.

Possible future features:

 - Broadcast queue size to all clients.
 - Broadcast currently playing track and who played it.
 - Broadcast queue length in seconds to all clients.



Scratchpad
----------

 - and/or allow people to visit any URL, if that room doesn't currently exist, allow them to create one?
 - only one host per room
 - if someone tries to go to a host URL of a room that already exists, kick them out to the index
 - if someone goes to the host URL of a room that doesn't exist, create it
 - if someone goes to the url of a room that doesn't exist, kick them out to the index
 - if someone goes to the url of a room that does exist, they should see the file list


Articles
--------

 * http://www.hacksparrow.com/express-js-tutorial.html
 * http://www.hacksparrow.com/handle-file-uploads-in-express-node-js.html
 * http://stackoverflow.com/questions/5778245/expressjs-how-to-structure-an-application
 * http://expressjs.com/api.html
 * http://calv.info/node-and-express-tips/
