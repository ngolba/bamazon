const mysql = require('mysql');
const inquirer = require('inquirer');
const serverPassword = require('./keys');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: serverPassword,
    database: "bamazon"
});

let allItemIDs = [];
let selectedItem = {};
const getAllItemIDs = () => {
    return new Promise((resolve, reject) => {
        connection.query('select item_id from products', (err, res) => {
            if (err) throw err;
            resolve(res.map(x => x.item_id));

        })
    })
}

const printInventory = (ids) => {
    allItemIDs = ids;
    return new Promise((resolve, reject) => {
        connection.query('select * from products', (err, res) => {
            if (err) throw err;
            console.table(res);
            resolve()
        })
    })
}

const purchase = (item, numPurchased) => {
    item.stock_quantity -= numPurchased;
    connection.query('update products set stock_quantity = ? where item_id = ?', [
        item.stock_quantity,
        item.item_id
    ], (err, res) => {
        if (err) throw err;
        let purchasePrice = (item.price * numPurchased).toFixed(2);
        console.log(`\nPurchase price: \$${purchasePrice}`)
        connection.end();
    })
}

const gatherInput = () => {
    inquirer.prompt([{
            type: 'input',
            name: 'itemID',
            message: 'What is the ID of the item you wish to purchase?',
            validate: (value) => isNaN(value) ? false : true
        },
        {
            type: 'input',
            name: 'itemQuantity',
            message: 'How many would you like to purchase?',
            validate: (value) => isNaN(value) ? false : true
        }
    ]).then(answers => {
        let idAnswered = parseInt(answers.itemID);
        let quantityAnswered = parseInt(answers.itemQuantity);
        if (allItemIDs.indexOf(idAnswered) === -1) {
            console.log('Unrecognized Item ID Number');
            gatherInput();
        } else {
            connection.query('select * from products where ?', {
                item_id: idAnswered
            }, (err, res) => {
                if (err) throw err;
                selectedItem = res[0];
                if (selectedItem.stock_quantity >= quantityAnswered) {
                    purchase(selectedItem, quantityAnswered)
                } else {
                    console.log('Insufficient quantity!')
                    gatherInput();
                }
            })
        }
    })
}


connection.connect((err) => {
    if (err) throw err;

    getAllItemIDs()
        .then((response) => printInventory(response))
        .then(() => gatherInput())

});

export {getAllItemIDs};