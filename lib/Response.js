function addResMethods (res) {
  res.status = function (code) {
    this.statusCode = code;
    return this;
  };
  res.send = function (data) {
    this.write(data);
    this.end();
  };
  return res;
}

module.exports = addResMethods;