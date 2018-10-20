const inquirer = require('inquirer');
const shared = require('./shared');

const newDepartment = () => {
    inquirer.prompt([{
            type: 'input',
            name: 'name',
            message: 'New department name?'
        },
        {
            type: 'input',
            name: 'overHead',
            message: 'Overhead costs?',
            validate: val => (isNaN(val) || val < 0) ? false : true,
            filter: val => parseFloat(val)
        }
    ]).then(answers => shared.newDepartment(answers.name, answers.overHead))
}

shared.establishConnection()

inquirer.prompt([{
    type: 'list',
    name: 'task',
    message: 'Which function would you like to perform?',
    choices: ['View product sales by department.', 'Create new department.']
}]).then(answers => answers.task === 'View product sales by department.' ? shared.printDepartmentSales() : newDepartment())