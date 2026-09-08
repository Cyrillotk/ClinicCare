// Blocks access to a route unless a user is logged in (session.userId set).
// Used on every page/route that should only be reachable by signed-in staff.
exports.requireAuth = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        req.flash("error", "Please log in to continue.");
        return res.redirect("/login");
    }

    next();
};

// Makes the logged-in user's info available to every EJS view
// (used in the shared nav partial) without repeating it in every controller.
exports.attachUser = (req, res, next) => {
    res.locals.currentUser = req.session.username || null;
    next();
};
