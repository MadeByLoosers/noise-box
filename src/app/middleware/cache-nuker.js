module.exports = function () {

    return function (req,res,next) {
        res.header("Cache-Control","no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0");
        res.header("Expires","0");
        res.header("Pragma","no-cache");
        next();
    };
};
