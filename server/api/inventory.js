var app = require('express')();
var server = require('http').Server(app);
var bodyParser = require('body-parser');
var Datastore = require('nedb');
var async = require('async');

app.use(bodyParser.json());

module.exports = app;

//creates database
var invDB = new Datastore({
    filename: "./server/databases/inventory.db",
    autoload: true
})
//GET inventory
app.get("/", function(req, res) {
    res.send("Inventory API");
})
//GET a product by id
app.get("/product/:productId", function(req, res) {
    if (!req.params.productId){
        res.status(500).send("Id field is required");
    }
    else {
        invDB.findOne({_id: req.params.productId}, function(req, product) {
            res.send(product)
        })
    }
})
//get all inventory products
app.get("/product", function(req, res) {
    invDB.find({}, function(req, docs) {
        console.log("sending inventory products");
        res.send(docs)
    })
})
//create inventory product
app.post("/product", function(req, res) {
    var newProduct = req.body;
    invDB.insert(newProduct, function(err, product) {
        if (err) res.status(500).send(err);
        else res.send(product);
    });
})
//delete the product id
app.delete("/product/:productId", function(req, res) {
    invDB.remove({_id: req.params.productId}, function(err, numRem) {
        if (err) res.status(500).send(err);
        else res.sendStatus(200);
    })
})
//update the inventory
app.put("/product", function(req, res) {
    var product_id = req.body._id;
    invDB.update({_id: product_id}, req.body, function(err, numReplace, product) {
        if (err) res.status(500).send(err);
        else res.sendStatus(200);
    })
})
app.decrementInventory = function(products) {
    async.eachSeries(products, function(transactionProduct, cb) {
        invDB.findOne({_id: transactionProduct._id}, function(err, product) {
            //catch items that don't exist
            if (!product || !product.quantity_on_hand) {
                cb();
            }
            else {
                var updatedQuantity = parseInt(product.quantity_on_hand) - parseInt(transactionProduct.quantity);
                invDB.update({_id: product._id}, {$set: {quantity_on_hand: updatedQuantity}}, {}, cb);
            }
        })
    })
}
