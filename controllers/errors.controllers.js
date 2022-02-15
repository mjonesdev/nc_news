exports.customErrorHandler = (err, req, res, next) => {
    if (err.msg === "Resource not found") res.status(404).send(err)
    if (err.msg === "Incorrect query received") res.status(400).send(err)
    else next(err)
}

exports.psqlErrorHandler = (err, req, res, next) => {
    if (err.code === '22P02') res.status(400).send({msg: "Article ID passed not a number"})
    if (err.code === '23502') res.status(400).send({msg: "Bad request: required data not supplied correctly"})
    else next(err)
}

exports.serverErrorHandler = (err, req, res, next) => {
    res.status(500).send({msg: "Server error. Please try again later"})
}
