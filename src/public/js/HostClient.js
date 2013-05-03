/*global _gaq*/
/**
 * NoiseBox
 * HomeClient.js
 *
 * Host page.
 */

define(["constants","AbstractClient","jquery"], function (Const,AbstractClient) {

    return AbstractClient.extend({

        currentTrack : null,
        audioElement : null,

        init : function () {

            if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                window.location = "/boot?m=Sorry your browser doesn't support playback of MP3s, try Google Chrome";
            } else {
                this._super();
            }
        },

        onConnect : function () {

            this._super();

            this.log({ eventType: "room-created" });
            this.log({ eventType: "share-link" });

            // some mobile/touch devices require the user
            // to add an audio track via touch interaction
            if ('ontouchstart' in document.documentElement) {
                this.log({ eventType: "audio-start-note" });
                $('.audio-start').one('click', _.bind(this.addAudioStartNote, this));
            }

            this.emit(Const.HOST_CONNECT);
        },


        addAudioStartNote : function(e) {
            e.preventDefault();
            var $a = $(e.target),
                $li = $a.closest('li');

            $li.slideUp();

            this.audioElement = $("<audio />")
                .attr("id", "audio-player")
                .attr("preload", "auto")
                .attr("src", "/noise/alive.mp3")
                .appendTo("body");

            this.audioElement.on('ended', function(e) {
                this.audioElement.off('ended');
            });

            this.audioElement[0].load();
            this.audioElement[0].play();

        },


        onServerAddTrack : function (data) {

            this.playQueue.push(data);
            this.play();

            this._super(data);
        },


        onTrackComplete : function () {

            this.emit(Const.HOST_TRACK_COMPLETE,this.currentTrack);

            this.currentTrack = null;

            if (this.playQueue.length > 0) {
                this.play();
            }
        },


        play : function() {

            if (!this.currentTrack) {

                this.currentTrack = this.playQueue.shift();

                this.emit(Const.HOST_TRACK_PLAYING,this.currentTrack);

                if (!!this.audioElement) {
                    this.audioElement.off('ended');
                    this.audioElement.off('loadedmetadata');
                    this.audioElement.attr("src", this.currentTrack.track);
                } else {
                    this.audioElement = $("<audio />")
                        .attr("id", "audio-player")
                        .attr("preload", "auto")
                        .attr("src", this.currentTrack.track)
                        .appendTo("body");
                }

                this.audioElement[0].load();
                this.audioElement[0].play();

                this.audioElement.on('ended', $.proxy(this.onTrackComplete, this) );

                this.audioElement.on('loadedmetadata', function(e) {
                    console.log("track duration", Math.floor(this.duration));
                });

                _gaq.push(['_trackEvent','track', this.currentTrack.track, this.noiseBoxID]);

                // get track current time
                //this.audioElement.on('ontimeupdate', function(e) {
                //    console.log("time", Math.floor(this.currentTime) + ' / ' + Math.floor(this.duration));
                //});

            }
        }
    });
});