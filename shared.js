const mysql = require('mysql')
const serverPassword = require('./keys');
const cTable = require('console.table');

const sharedAssets = () => {
    let allItemIDs = [],
    allDepartmentNames = [],
    currentItem = {},
    connection = mysql.createConnection({
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

            let query = (managerPrivileges ? 'select * ' : 'select item_id, product_name, department_name, price, stock_quantity ') + `from products ${stipulation}`;
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
            [currentItem.stock_quantity += quantity, currentItem.item_id],
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

    endConnection = () => connection.end();

    printDepartmentSales = () => {
        connection.query('select d.department_id, d.department_name, d.over_head_costs, sum(p.product_sales) as product_sales, (sum(p.product_sales) - d.over_head_costs) as total_profit from departments as d left join products as p on d.department_name=p.department_name group by d.department_name',
            (err, res) => {
                if (err) throw err;
                console.table(res);
                endConnection();
            }
        )
    }

    newDepartment = (name, overHead) => {
        connection.query('insert into departments (department_name, over_head_costs)  values (?, ?)', 
        [name, overHead], 
        (err, res) => {
            if (err) throw err;
            console.log('New department added.')
            endConnection();
        })
    }

    


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
        printDepartmentSales: printDepartmentSales,
        newDepartment: newDepartment
    }
}

module.exports = sharedAssets();