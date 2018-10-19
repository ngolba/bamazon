const inquirer = require('inquirer');
const cTable = require('console.table');
const shared = require('./shared');

const purchase = (item, numPurchased) => {
    item.stock_quantity -= numPurchased;
    shared.updateStock(item.stock_quantity);

    let purchasePrice = (item.price * numPurchased).toFixed(2);
    console.log(`\nPurchase price: \$${purchasePrice}`)

    shared.endConnection();
}

const checkStock = answers => {
    return new Promise((resolve, reject) => {
        shared.selectItem(answers.itemID)
            .then(item => {
                (item.stock_quantity < answers.itemQuantity) ? reject('Insufficient quantity!'): resolve(item);
            })
    })
}

const gatherInput = () => {
    inquirer.prompt([{
            type: 'input',
            name: 'itemID',
            message: 'What is the ID of the item you wish to purchase?',
            validate: val => shared.allItems().indexOf(val) === -1 ? false : true,
            filter: val => parseInt(val)
        },
        {
            type: 'input',
            name: 'itemQuantity',
            message: 'How many would you like to purchase?',
            validate: val => (isNaN(val) || !Number.isInteger(val) || val < 0) ? false : true,
            filter: val => parseFloat(val)
        }
    ]).then(answers => {
        checkStock(answers)
            .then(response => {
                purchase(response, answers.itemQuantity)
            })
            .catch(response => {
                console.log(response);
                gatherInput()
            })
    })

}

shared.establishConnection();
shared.getAllItemIDs()
    .then(() => shared.printInventory())
    .then(() => gatherInput())