const app = require("./src/index.ts");

app.get('/', (req, res) => {
    res.send('Hello World')
  })

module.exports = app;