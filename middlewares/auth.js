const auth = (req,res,next) => {

    if (req.session.user) {

        res.locals.isLoggedIn = true;
        res.locals.user = req.session.user;

    } else {

        res.locals.isLoggedIn = false;
        res.locals.user = null;

    }

    next();
}

module.exports = auth;