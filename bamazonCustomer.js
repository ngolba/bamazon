const mysql = require('mysql');
const inquirer = require('inquirer');
const serverPassword = require('./keys');

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
            allItemIDs = res.map(x => x.item_id);
            resolve(allItemIDs);
        })
    })
}

const printInventory = () => {
    return new Promise((resolve, reject) => {
        connection.query('select * from products', (err, res) => {
            if (err) throw err;
            console.table(res);
            // connection.end();
            resolve()
        })
    })
}

const purchase = (item, numPurchased) => {
    item.stock_quantity -= numPurchased;
    connection.query('update products set ? where ?', {stock_quantity: item.stock_quantity, item_id: item.item_id}, (err, res) => {
        if (err) throw err;
        let purchasePrice = (item.price * numPurchased);
        console.log(`Purchase price: ${purchasePrice}`)
        connection.end();
    })
}

const gatherInput = () => {
    inquirer.prompt([{
            type: 'input',
            name: 'itemID',
            message: 'What is the ID of the item you wish to purchase?'
        },
        {
            type: 'input',
            name: 'itemQuantity',
            message: 'How many would you like to purchase?'
        }
    ]).then(answers => {
        if (allItemIDs.indexOf(answers.itemID) === -1) {
            console.log('Unrecognized Item ID Number');
            gatherInput();
        }
        connection.query('select * from products where ?', {item_id: answers.itemID}, (err, res) => {
            if (err) throw err;
            selectedItem = res;
            selectedItem.stock_quantity >= answers.itemQuantity ? purchase(selectedItem, answers.itemQuantity) : console.log('Insufficient quantity!')
        })
    })
}


connection.connect((err) => {
    if (err) throw err;

    getAllItemIDs()
        .then((response) => printInventory())
        .then(() => gatherInput())

});