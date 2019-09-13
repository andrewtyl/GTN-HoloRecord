function requireAuth(req, res, next) {
    console.log(req);
    console.log(res);
    console.log(next);
    return res.status(200).json('Require Auth successfully called')
}

module.exports = {
    requireAuth
}