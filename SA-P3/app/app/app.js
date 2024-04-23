const express = require('express');
const app = express();
const port = 3000;

app.get("/", (request, response) => {
    response.send("App funcional en puerto 3000");
});

app.listen(port, () => {
    console.log("Puerto expuesto: ", port);
})