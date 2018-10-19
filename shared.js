const mysql = require('mysql')
const serverPassword = require('./keys');

const sharedAssets = (() => {
    let allItemIDs = [];
    let currentItem = {};
    const connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: serverPassword,
        database: "bamazon"
    });

    allItems = () => allItemIDs;
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

    printInventory = (stipulation = '') => {
        return new Promise((resolve, reject) => {
            let query = 'select * from products' + stipulation;
            connection.query(query, (err, res) => {
                if (err) throw err;
                console.table(res);
                resolve()
            })
        })
    }

    selectItem = (id) => {
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

    updateStock = (quantity) => {
        connection.query('update products set stock_quantity = ? where item_id = ?', [
            quantity,
            currentItem.item_id
        ], (err, res) => {
            if (err) throw err;
        })
    }

    endConnection = () => {
        connection.end();
    }

    return {
        establishConnection: establishConnection,
        getAllItemIDs: getAllItemIDs,
        printInventory: printInventory,
        allItems: allItems,
        selectItem: selectItem,
        updateStock: updateStock,
        endConnection: endConnection
    }
})()

module.exports = sharedAssets;