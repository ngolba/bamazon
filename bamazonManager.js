const inquirer = require('inquirer');
const cTable = require('console.table');
const shared = require('./shared');

const addStock = () => {
    inquirer.prompt([{
            type: 'input',
            name: 'itemID',
            message: 'To which item would you like to add stock?',
            validate: val => shared.allItems().indexOf(val) === -1 ? false : true,
            filter: val => parseInt(val)
        },
        {
            type: 'input',
            name: 'stockAdded',
            message: 'How many would you like to add to the stock?',
            validate: val => isNaN(val) ? false : true,
            filter: val => parseInt(val)
        }
    ]).then(answers => {
        shared.selectItem(answers.itemID).then((item) => {
            item.stock_quantity += answers.stockAdded;
            shared.updateStock(item.stock_quantity)
        })
    })
}

const inquireTask = () => {
    inquirer.prompt([{
        type: 'list',
        name: 'task',
        message: 'Which task would you like to perform?',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
    }]).then(answers => {
        console.log(answers);
        if (answers.task === 'View Products for Sale') {
            shared.printInventory();
        } else if (answers.task === 'View Low Inventory') {
            shared.printInventory(' where stock_quantity < 5');
        } else if (answers.task === 'Add to Inventory') {
            addStock();
        }
    })
}

const addNewProduct = () => {}

shared.establishConnection()
shared.getAllItemIDs().then(inquireTask())