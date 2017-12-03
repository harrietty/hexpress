const url = require('url');
module.exports = (req) => {
  const {pathname} = url.parse(req.url);
  const {method} = req;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot ${method} ${pathname}</pre>
</body>
</html>`.trim();
  return html;
}