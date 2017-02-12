var express = require('express');
var gpio = require('pi-gpio');
var router = express.Router();

var listOfPis = [
    {
        name: 'node01',
        gpio: 23,
        physical: 16,
        isMaster: true
    }, {
        name: 'node02',
        gpio: 24,
        physical: 18,
        isMaster: false
    }, {
        name: 'node03',
        gpio: 4,
        physical: 7,
        isMaster: false
    }, {
        name: 'node04',
        gpio: 17,
        physical: 11,
        isMaster: false
    }, {
        name: 'node05',
        gpio: 27,
        physical: 13,
        isMaster: false
    }, {
        name: 'node06',
        gpio: 22,
        physical: 15,
        isMaster: false
    }, {
        name: 'node07',
        gpio: 10,
        physical: 19,
        isMaster: false
    }, {
        name: 'node08',
        gpio: 9,
        physical: 21,
        isMaster: false
    }
];

function getPiAtGPIO(gpio) {
    var pi = listOfPis.filter(function(pi) {
       return pi.gpio.toString() === gpio;
    });
    return pi.length === 1 ? pi[0] : null;
}

// Listing functions
router.get('/', function (req, res, next) {
    res.render('pis', {pis: listOfPis});
});

// Reset functions
router
    .get('/reset/:id', function (req, res) {
        var pi = getPiAtGPIO(req.params.id);
        if (pi)
            res.render('reset', {pi: pi});
        else
            res.send('There is no Pi at that pin address.');
    })
    .post('/reset/:id', function (req, res) {
        var pi = getPiAtGPIO(req.params.id);
        if (pi) {
            var pin = pi.physical;
            gpio.open(pin, 'output', function (err) {
                gpio.write(pin, 1, function (err) {
                    setTimeout(function () {
                        gpio.write(pin, 0, function () {
                            gpio.close(pin, function () {
                                res.render('resetdone', {pi: pi});
                            });
                        });
                    }, 2000);
                });
            });
        }
        else
            res.send('There is no Pi at that pin address');
    });

// Power off functions
router
    .get('/poweroff/:id', function (req, res) {
        var pi = getPiAtGPIO(req.params.id);
        if (pi)
            res.render('poweroff', {pi: pi});
        else
            res.send('There is no Pi at that pin address.');
    })
    .post('/poweroff/:id', function (req, res) {
        var pi = getPiAtGPIO(req.params.id);
        if (pi) {
            var pin = pi.physical;
            gpio.open(pin, 'output', function(err){
                gpio.write(pin, 1, function(err){
                    res.render('poweroffdone', {pi: pi});
                });
            });
        }
        else
            res.send('There is no Pi at that pin address');
    });

module.exports = router;
