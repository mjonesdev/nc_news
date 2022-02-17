const endpointsFile = require("../endpoints.json")

exports.getApiInformation = (req, res, next) => {
    res.status(200).json(endpointsFile)
}