var express = require('express'),
    http = require('http'),
    port = 8098,
    app = require('express')(),
    server = http.createServer(app),
    bodyParser = require('body-parser'),
    io = require('socket.io')(server),
    livecart;

    console.log("Real time POS running");
    console.log("Server started");
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false}));

    app.all('/*', function(req, res, next) {
        //CORS headers
        res.header("Access-Control-Allow-Origin", "*") //restrict it to the required domain
        res.header("Access-Control-Allow-Methods", "GET,PUT,DELETE,POST,OPTIONS");
        //set custom headers
        res.header("Access-Control-Allow-Headers", "Content-type,Accept,X-Access-Token,X-Key");

        if (req.method == 'OPTIONS') {
            res.status(200).end();
        }
        else {
            next();
        }
    })
    app.get('/', function(req, res) {
        res.send("POS is running...");
    })
    app.get('/api/inventory', require('./server/api/inventory'));
    app.get('/api', require('./server/api/transactions'));

    //websocket logic for live cart
    io.on("connection", function(socket) {
        socket.on("cart-transaction-complete", function() {
            socket.broadcast.emit("update-live-cart-display", {});
        })

        //on page load, show user current cart
        socket.on("live-cart-page-loaded", function() {
            socket.broadcast.emit("update-live-cart-display", livecart);
        })

        //when client connects, make client update live cart
        socket.emit("update-live-cart-displapy", livecart);

        //when the cart data is updated by the POS
        socket.on("update-live-cart", function(cartData) {
            //keep track of it
            livecart = cartData

               //broadcast updated lice cart to all websockets clients
        socket.broadcast.emit("update-live-cart-display",livecart);
        })

    })

    server.listen(port, () => console.log(`Listening on port ${port}`));


