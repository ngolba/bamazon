const inquirer = require('inquirer');
const shared = require('./shared');

const {updateStock, updateSales, endConnection, selectItem, allItems, getAllItemIDs, printInventory, establishConnection} = shared;

const purchase = (item, numPurchased) => {

    updateStock(numPurchased * -1);
    updateSales((item.price * numPurchased));
    
    inquirer.prompt([{
        type: 'confirm',
        name: 'moreTransactions',
        message: 'Would you like to make another purchase?'
    }]).then(answers => answers.moreTransactions ? purchaseProcess() : endConnection())
}

const checkStock = answers => {
    return new Promise((resolve, reject) => {
        selectItem(answers.itemID)
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
            validate: val => allItems().indexOf(val) === -1 ? false : true,
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

const purchaseProcess = () => {
    getAllItemIDs()
    .then(() => printInventory())
    .then(() => gatherInput())
}

establishConnection();
purchaseProcess();
