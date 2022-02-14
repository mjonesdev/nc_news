

exports.serverErrorHandler = (err, req, res, next) => {
    res.status(500).send({msg: "Server error. Please try again later"})
}