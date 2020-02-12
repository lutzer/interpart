const { app } = require("./app")
const config = require("./config")

app.listen(config.port, () => console.log(`Interpart Server listening on port ${config.port}!`))
