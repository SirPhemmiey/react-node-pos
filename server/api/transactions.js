var app = require('express')();
var server = require('http').Server(app);
var bodyParser = require('body-parser');
var Datastore = require('nedb');

var Inventory = require('./inventory');

app.use(bodyParser.json());

module.exports = app;

//create database
var transDB = new Datastore({
    filename: './server/database/transactions.db',
    autoload: true
})

app.get("/", function(req, res) {
    res.send("Transactions API");
})

//GET all transaction
app.get("/all", function(err, res) {
    transDB.find({}, function(err, docs) {
        res.send(docs);
    })
})
//GET limited transaction
app.get("/limit", function(req, res) {
    var limit = parseInt(req.query.limit, 10);
    if (!limit) limit = 5;
    transDB.find({}).limit(limit).sort({date: -1}).exec(function(err, docs) {
        res.send(docs);
    })
})
//GET total sales for the current day
app.get("/day-total", function(req, res) {
    //if the date is provided
    if (req.query.date) {
        startDate = new Date(req.query.date);
        startDate.setHours(0,0,0,0);

        endDate = new Date(req.query.date);
        endDate.setHours(23,59,59,999);
    }
    else {
        //beginning of the current day
        startDate = new Date();
        startDate.setHours(0,0,0,0);

        //end of current day
        endDate = new Date();
        endDate.setHours(23,59,59,999);
    }

    transDB.find({date: {$gte: startDate.toJSON(), $lte: endDate.toJSON()}}, function(err, docs) {
        var result = {
            date: startDate
        }
        if (docs) {
            var total = docs.reduce(function(previousValue, index) {
                return previousValue + index.total
            }, 0.00);

            result.total = parseFloat(parseFloat(total).toFixed(2));
            res.send(result)
        }
        else {
            result.total = 0;
            res.send(result);
        }
    })
})
//GET transactions for a particular date
app.get("/by-date", function(req, res) {
    var startDate = new Date(2018, 2, 21);
    startDate.setHours(0,0,0,0);

    var endDate = new Date(2015,2,21);
    endDate.setHours(23,59,59,999);

    transDB.find({date: {$gte: startDate.toJSON(), $lte: endDate.toJSON()}}, function(err, docs) {
        if (docs) {
            res.send(docs)
        }
    })
})
//Add new transaction
app.post("/new", function(req, res) {
    var newTrans = req.body;
    transDB.insert(newTrans, function(err, tran) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(200);
            Inventory.decrementInventory(tran.products)
        }
    })
})
//GET a single transaction
app.get("/:transactionId", function(req, res) {
    transDB.find({_id: req.params.transactionId})
})