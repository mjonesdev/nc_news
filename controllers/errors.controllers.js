
exports.customErrorHandler = (err, req, res, next) => {
    if (err.msg === "No article found with that ID") res.status(404).send(err)
    else next(err)
}

exports.psqlErrorHandler = (err, req, res, next) => {
    if (err.code === '22P02') res.status(400).send({msg: "Article ID passed not a number"})
    else next(err)
}

exports.serverErrorHandler = (err, req, res, next) => {
    res.status(500).send({msg: "Server error. Please try again later"})
}
