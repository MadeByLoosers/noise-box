/**
 * NoiseBox
 * nb.js
 *
 * Main NoiseBox client module. Creates an appropriate client class instance to handle the
 * different types of client.
 */

define(["HomeClient","HostClient","UserClient","constants","jquery"], function (HomeClient,HostClient,UserClient,Const) {

    var init = function () {
$('.popup').click(function(){
  window.open(this.href, 'window name', 'window settings');
  return false;
});

        $(function () {

            var client;
            var clientType = $("body").attr("id");

            switch ( clientType ) {

                case Const.TYPE_HOME:
                    client = new HomeClient();
                    break;
                case Const.TYPE_HOST:
                    client = new HostClient();
                    break;
                case Const.TYPE_USER:
                    client = new UserClient();
                    break;
                default:
                    throw(new Error("Client type '"+clientType+"' not recognised"));
            }
        });
    };

    return {

        init : init
    };
});