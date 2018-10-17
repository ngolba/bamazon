const mysql = require('mysql');
const inquirer = require('inquirer');
const serverPassword = require('./keys');
const cTable = require('console.table');
let allItemIDs = [];
import getAllItemIDs from './bamazonCustomer'

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: serverPassword,
    database: "bamazon"
});

const viewProducts = () => {
    connection.query('select * from products', (err, res) => {
        if (err) throw err;
        console.table(res)
    })
}

const lowInventory = () => {
    connection.query('select * from products where stock_quantity < 5', (err, res) => {
        if (err) throw err;
        console.table(res)
    })
}

const addStock = () => {
    inquirer.prompt([{
        type: 'input',
        name: 'itemID',
        message: 'To which item would you like to add stock?',
        validate: (value) => isNaN(value) ? false : true
    },{
        type: 'input',
        name: 'stockAdded',
        message: 'How many would you like to add to the stock?',
        validate: (value) => isNaN(value) ? false : true
    }]).then(answers => {

    })
}

const addNewProduct = () => {}

connection.connect((err) => {
    if (err) throw err;

    getAllItemIDs().then(response => {allItemIDs = response
        console.log(allItemIDs)})

});