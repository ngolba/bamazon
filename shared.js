const mysql = require('mysql')
const serverPassword = require('./keys');
const cTable = require('console.table');

const sharedAssets = (() => {
    let allItemIDs = [];
    let allDepartmentNames = [];
    let currentItem = {};
    const connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: serverPassword,
        database: "bamazon"
    });

    allItems = () => allItemIDs;
    allDepartments = () => allDepartmentNames;
    selectedItem = () => currentItem;

    establishConnection = () => {
        connection.connect((err) => {
            if (err) throw err;
        })
    }

    getAllItemIDs = () => {
        return new Promise((resolve, reject) => {
            connection.query('select item_id from products', (err, res) => {
                if (err) throw err;
                allItemIDs = res.map(x => x.item_id)
                resolve();
            })
        })
    }

    getAllDepartments = () => {
        return new Promise((resolve, reject) => {
            connection.query('select distinct department_name from products', (err, res) => {
                if (err) throw err;
                allDepartmentNames = res.map(x => x.department_name)
                resolve();
            })
        })
    }

    printInventory = (managerPrivileges = false, stipulation = '') => {
        return new Promise((resolve, reject) => {

            let query = (managerPrivileges ? 'select * ' : 'select item_id, product_name, department_name, price, stock_quantity') + `from products ${stipulation}`;
            connection.query(query, (err, res) => {
                if (err) throw err;
                console.log(`\n`);
                console.table(res);
                resolve()
            })
        })
    }

    selectItem = id => {
        return new Promise((resolve, reject) => {
            connection.query('select * from products where ?', {
                item_id: id
            }, (err, res) => {
                if (err) throw err
                currentItem = res[0]
                resolve(selectedItem());
            })
        })
    }

    updateStock = quantity => {
        connection.query('update products set stock_quantity = ? where item_id = ?',
            [currentItem.stock_quantity -= quantity, currentItem.item_id],
            (err, res) => {
                if (err) throw err;
            })
    }

    updateSales = purchasePrice => {
        console.log(`\nPurchase price: \$${purchasePrice.toFixed(2)}`)
        console.log(`\n*********************************************\n`)
        connection.query('update products set product_sales = ? where item_id = ?',
            [currentItem.product_sales += purchasePrice, currentItem.item_id],
            (err, res) => {
                if (err) throw err;
            }
        )
    }

    newItem = (name, department, price, stock) => {
        connection.query('insert into products (product_name, department_name, price, stock_quantity) values (?, ?, ?, ?)',
            [name, department, price, stock],
            (err, res) => {
                if (err) throw err;
                console.log(`Item: ${name} has been added.`)
            }
        )
    }

    updateDepartmentSales = () => {}


    endConnection = () => connection.end();


    return {
        establishConnection: establishConnection,
        getAllItemIDs: getAllItemIDs,
        printInventory: printInventory,
        allItems: allItems,
        selectItem: selectItem,
        updateStock: updateStock,
        endConnection: endConnection,
        getAllDepartments: getAllDepartments,
        allDepartments: allDepartments,
        newItem: newItem,
        updateSales: updateSales,
        updateDepartmentSales: updateDepartmentSales
    }
})()

module.exports = sharedAssets;