/*global _gaq*/
/**
 * NoiseBox
 * UserClient.js
 *
 * Host page NoiseBox client.
 */

define(["constants","AbstractClient","jquery","underscore", "scrollspy", "tabs", "stickyheaders"], function (Const,AbstractClient) {

    return AbstractClient.extend({

        usernameField : null,
        chatField : null,
        tracks : null,
        user : {
            id : "", // room id
            username : "",
            cid : "",
            userid : ""
        },
        broadcastMode: true, // false for preview
        audioElement : null,
        debounceTimeout : null,

        init : function () {

            this._super();

            this.tracks = $("#track-list a");
            this.tracks.on("click", _.bind(this.onTrackClicked,this));

            $("#username-form").on("submit", _.bind(this.onUsernameUpdate,this));

            $("#chat-form").on("submit", _.bind(this.onChatMessage,this));

            $("#play-mode-form input[name=play-mode]").on("change", _.bind(this.onPlayModeChange,this));

            $("#track-search").focus().on("keyup search", _.bind(this.debounceFilterContent,this));

            $("#username-display a").on("click", this.showUsernameForm);

            this.usernameField = $("#username");
            this.chatField = $("#chat-text");

            this.on(Const.USER_ADDED,this.updateUsernameField);
            this.on(Const.USER_UPDATED,this.updateUsernameField);

            this.on(Const.SERVER_SOCKET_CONNECT,this.detectTransport);

            this.on(Const.SERVER_ADD_TRACK,this.onTrackQueued);
            this.on(Const.HOST_TRACK_PLAYING,this.onTrackPlaying);
            this.on(Const.HOST_TRACK_COMPLETE,this.onTrackComplete);


            // scroll spy
            $('#album-list .scrollable li').first().addClass('active');
            $('#track-list .scrollable').scrollspy({target:"#album-list .scrollable"});

            // sticky headers - not for touch devices
            if (!('ontouchstart' in document.documentElement)) {
                $("#track-list .scrollable").stickySectionHeaders({
                    childEl         : '.tracks',
                    stickyClass     : 'sticky',
                    headlineSelector: 'h4'
                });
            }

            // tabs
            $('#stats-tabs .tabs a:first').tab('show');

            this.initSmoothScroll();
        },

        onTrackClicked : function (event) {

            event.preventDefault();

            var $el, track, trackId, trackName, album;

            // sometimes click event may be span element within link el
            // if so, grab the <a> element
            if (event.target.nodeName.toLowerCase() === "a") {
                $el = $(event.target);
            } else {
                $el = $(event.target).closest('a');
            }

            track = $el.attr('href');
            trackId = $el.attr('id');
            trackName = $el.find('.trackname').text();
            album = $el.closest('.tracks').find('h4').text();

            if (this.broadcastMode) {
                this.emit(Const.USER_CLICKED_TRACK,{
                    track:track,
                    trackId:trackId,
                    trackName:trackName,
                    album:album
                });
            } else {
                this.previewTrack(track);
            }
        },

        onTrackQueued : function (trackData) {
            $('#'+trackData.trackId).find('.icon')
                .addClass("queued");
        },

        onTrackPlaying : function (trackData) {
            $('#'+trackData.trackId).find('.icon')
                .removeClass("queued")
                .addClass("playing")
                .removeClass("icon-plus")
                .addClass("icon-play");
        },

        onTrackComplete : function (trackData) {
            $('#'+trackData.trackId).find('.icon')
                .removeClass("queued")
                .removeClass("playing")
                .removeClass("icon-play")
                .addClass("icon-plus");
        },

        onPlayModeChange : function(event) {
            var $form = $(event.target).closest('form'),
                $labels = $form.find('label'),
                $label = $(event.target).closest('label');

                $labels.removeClass('active');
                $label.addClass('active');

            if (event.target.value === "broadcast") {
                this.broadcastMode = true;
            } else if (event.target.value === "preview") {
                this.broadcastMode = false;
            }
        },

        previewTrack : function(track) {

            // need to create a new audio element each time
            // can't just change the src of an existing element
            if (!!this.audioElement) {
                this.audioElement.remove();
            }

            this.audioElement = $("<audio />")
                .attr("id", "audio-player")
                .attr("preload", "auto")
                .attr("src", track)
                .appendTo("body");

            this.audioElement[0].play();
        },

        updateUsernameField : function(data) {

            this.user.username = data.username || "new user";
            var changed = false,
                $form = $("#username-form");

            if (!!window.localStorage && !!window.localStorage.username) {
                this.user.username = window.localStorage.username;
                changed = true;
            }

            this.usernameField.val(this.user.username);
            $("#username-display .username").text(this.user.username);
            $("#username-display i.icon-user").removeClass("default");


            if (!!data.id) {
                this.user.id = data.id;
            }
            if (!!data.cid) {
                $("#cid").val(data.cid);
                this.user.cid = data.cid;
            }
            if (!!data.userid) {
                $("#userid").val(data.userid);
                this.user.userid = data.userid;
            }

            if (changed) {
                $form.submit();
            }

            $form.fadeOut();
        },

        onUsernameUpdate : function (event) {

            if (!!event) { event.preventDefault(); }

            var $form = $("#username-form");

            this.user.username = this.usernameField.val();

            this.emit(Const.USER_NAME_UPDATE,this.user);

            if (!!window.localStorage) {
                window.localStorage.username = this.user.username;
            }

            this.chatField.removeAttr("disabled");
            this.chatField.removeAttr("readonly");
            this.chatField.attr("Placeholder","Add message");
            $("#chat-form input[type='submit']").removeAttr("disabled");

            $form.fadeOut();
            $("#username-display .username").text(this.user.username);
            $("#username-display i.icon-user").removeClass("default");

            _gaq.push(['_trackEvent','user','login', this.noiseBoxID]);
        },


        onChatMessage : function (event) {

            if (!!event) { event.preventDefault(); }

            if (this.chatField.val().length > 0) {

                this.emit(Const.CHAT_MESSAGE_SENT, { message: this.chatField.val(), user: this.user});
                this.chatField.val("");

                _gaq.push(['_trackEvent','chat', 'talking', this.noiseBoxID]);
            }

        },


        // debounce the search filter, so it doesn't happen immediately after every key input
        debounceFilterContent: function(event) {
            var self = this;
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(function(){
                self.filterContent.call(self, event, self.tracks);
            }, 250);
        },


        // filter search content based on user input
        // also used to reset the search content to default state
        filterContent: function(e, tracks) {

            var self = this,
                searchTerm = e.target.value,
                searchWords, match, counter = 0;

            // create an array of any search words, split on spaces
             searchWords = searchTerm.split(/\s+/g),

            // loop through all searchable items...
            _.each(tracks, function(track){

                // match each search word - separated on a space
                // assume we have a match by default...
                match = true;

                // if no term is specified, we're resetting... (so probably showing all)
                if (!!searchTerm) {
                    _.each(searchWords, function(word){
                        if (track.innerHTML.indexOf(word.toLowerCase()) === -1) {
                            match = false;
                            return;
                        }
                    });
                }

                // condition : was there a match? If so, show item
                if (!match) {
                    track.parentNode.className = "hidden";
                } else {
                    counter++;
                    track.parentNode.className = "";
                }
            });

            // add counter
            $(".search-results").remove();
            if (counter < 1) {
                $("<p>")
                    .addClass("search-results")
                    .text("no results found")
                    .appendTo($("#track-list .scrollable"));
            }

            // show/hide clear icon
            var $searchClear = $(".search-clear");
            if (searchTerm.length < 1) {
                $searchClear.remove();
            } else {
                if ($searchClear.length < 1) {
                    $searchClear = $("<i>")
                        .addClass("search-clear")
                        .addClass("icon-remove")
                        .appendTo($(".search-container"));

                    $searchClear.on("click", self.clearSearch);
                }
            }

            // show/hide titles
            $(".tracks").each(function(counter) {
                var $trackContainer = $(this),
                    $items = $trackContainer.find("li:not(.hidden)");

                if ($items.length < 1) {
                    $trackContainer.addClass("hidden");
                } else {
                    $trackContainer.removeClass("hidden");
                }
            });
        },


        clearSearch: function() {
            $("#track-search")
                .val("")
                .trigger("search");
        },


        showUsernameForm: function(e) {
            e.preventDefault();
            var $form = $("#username-form");
            $form.fadeToggle();
            $form.find("input[type=text]").focus();
        },


        detectTransport: function() {
            console.log("detected transport", this.socket.socket.transport.name);
            var transport = this.socket.socket.transport.name;
            if (transport !== 'websocket') {
                this.createFlashMessage("Your connection to NoiseBox isn't great, it could be improved by using a modern browser or connecting via wifi");
            }
        },


        onConnect : function () {

            this._super();

            this.emit(Const.USER_CONNECT);
        },


        initSmoothScroll : function() {

            var self = this;

            this.$scrollablePane = $("#track-list .scrollable");
            this.$trackBlocks = this.$scrollablePane.find(".tracks");
            this.trackBlockPositions = {};
            this.$trackBlocks.each(function(counter){
                self.trackBlockPositions[this.id] = $(this).position().top;
            });

            $("#album-list a").on("click", _.bind(this.smoothScroll, this));
        },


        smoothScroll : function (e) {
            e.preventDefault();

            var linkHref = e.target.href.split("#")[1],
                pos;

            pos = this.trackBlockPositions[linkHref];

            console.log(linkHref, pos);

            this.$scrollablePane.animate({
                scrollTop: pos
            }, 500);
        }
    });
});