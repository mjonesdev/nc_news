exports.customErrorHandler = (err, req, res, next) => {
    const errorReference = {
        "001": "Article not found",
        "051": "sorted_by and/or order query not valid"
    }
    if(err.msg) res.status(404).send({msg: err.msg})
    if (err.status) res.status(Number(err.status) < 50 ? 404 : 400).send({msg: errorReference[err.status]})
    else next(err)
}

exports.psqlErrorHandler = (err, req, res, next) => {
    if (err.code === '22P02') res.status(400).send({msg: "ID passed is not a number"})
    if (err.code === '23502') res.status(400).send({msg: "Bad request: required data not supplied correctly"})
    else next(err)
}

exports.serverErrorHandler = (err, req, res, next) => {
    res.status(500).send({msg: "Server error. Please try again later"})
}
