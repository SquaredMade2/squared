const app = require("../dist/index.js");

app.get('/', (req, res) => {
    res.send('Hello World')
  })

module.exports = app;