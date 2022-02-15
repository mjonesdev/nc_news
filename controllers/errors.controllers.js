exports.customErrorHandler = (err, req, res, next) => {
    const errorReference404 = {
        "001": "Reasource not found",
        "002": "Article ID passed is not a number",
        "003": "custom message received from error itself",
        "004": "Article not found"
    }
    const errorReference400 = {
        "101": "incorrect query recieved",
        "102": "sorted_by and/or order query not valid"
    }
    if(err.status === "003") res.status(404).send({msg: err.msg})
    else if (err.status in errorReference404) res.status(404).send({msg: errorReference404[err.status]})
    if (err.status in errorReference400) res.status(400).send({msg: errorReference400[err.status]})
    else next(err)
}

exports.psqlErrorHandler = (err, req, res, next) => {
    if (err.code === '22P02') res.status(400).send({msg: "Article ID passed is not a number"})
    if (err.code === '23502') res.status(400).send({msg: "Bad request: required data not supplied correctly"})
    else next(err)
}

exports.serverErrorHandler = (err, req, res, next) => {
    res.status(500).send({msg: "Server error. Please try again later"})
}
