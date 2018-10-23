const inquirer = require('inquirer');
const shared = require('./shared');
const {updateStock, selectItem, allDepartments, getAllItemIDs, getAllDepartments, establishConnection, printInventory, endConnection} = shared;

const proceed = () => {
    inquirer.prompt([{
        type: 'confirm',
        name: 'continue',
        message: 'Would you like to perform another task?'
    }]).then(answers => answers.continue ? inquireTask() : endConnection())
}

const addStock = () => {
    inquirer.prompt([{
            type: 'input',
            name: 'itemID',
            message: 'To which item would you like to add stock?',
            validate: val => allItems().indexOf(val) === -1 ? false : true,
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
        selectItem(answers.itemID).then((item) => {
            console.log(`${answers.stockAdded} ${item.product_name} ADDED`)
            updateStock(answers.stockAdded);
            proceed();
        })
    })
}

const addNewProduct = () => {
    inquirer.prompt([{
            type: 'input',
            name: 'name',
            message: 'Enter the product name.'
        }, {
            type: 'list',
            name: 'department',
            message: 'Select the department',
            choices: allDepartments()
        },
        {
            type: 'input',
            name: 'price',
            message: 'Enter the price.',
            validate: val => (isNaN(val) || val < 0) ? false : true,
            filter: val => parseFloat(val).toFixed(2)
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many of this item are in stock?',
            validate: val => (isNaN(val) || val < 0 || !Number.isInteger(val)) ? false : true,
            filter: val => parseFloat(val)
        }
    ]).then(answers => {
        newItem(answers.name, answers.department, answers.price, answers.quantity)
        setTimeout(() => proceed(), 1000);
    })
}

const inquireTask = () => {
    getAllItemIDs()
        .then(() => getAllDepartments())
        .then(() => {
            inquirer.prompt([{
                type: 'list',
                name: 'task',
                message: 'Which task would you like to perform?',
                choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit']
            }]).then(answers => {
                switch (answers.task) {
                    case 'View Products for Sale':
                        printInventory(true).then(() => proceed());
                        break;
                    case 'View Low Inventory':
                        printInventory(true, ' where stock_quantity < 5').then(() => proceed());
                        break;
                    case 'Add to Inventory':
                        printInventory(true).then(() => addStock())
                        break;
                    case 'Add New Product':
                        addNewProduct();
                        break;
                    default: 
                        console.log('Goodbye!');
                        endConnection();
                }
            })
        })
}

establishConnection()
inquireTask()