
class ApiMiddleware {

  index(req, res) {
    console.log('POST DATA')
    logger.token('POST DATA', function (req, res) { return [1,2,2] })
    console.log(JSON.stringify(req.body))
    return
  }

}

module.exports = { ApiMiddleware}