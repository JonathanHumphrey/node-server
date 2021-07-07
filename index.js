const server = require('./server');
const routes = ('./Routes/router-index');
const PORT = process.env.PORT || 5001;
require('dotenv').config();

server.get('/', (req, res) => {
    res.send('<h1>This is a test </h1>');
});

server.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
})