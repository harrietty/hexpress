function addResMethods (res) {
  res.status = function (code) {
    this.statusCode = code;
    return this;
  };
  res.send = function (data) {
    if (typeof data === 'object') {
      data = JSON.stringify(data);
      this.setHeader('Content-Type', 'application/json');
    }
    this.write(data);
    this.end();
  };
  return res;
}

module.exports = addResMethods;