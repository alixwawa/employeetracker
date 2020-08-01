const cTable = require('console.table');
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "",
    database: "employeedb"
});

connection.connect(err => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    console.table();
    start();
});

start = () => {
    //   console.log("works");
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "Add departments",
                "Add roles",
                "Add employees",
                "View departments, roles, and employees",
                "Update employee roles",
                // "Update employee managers",
                // "View employees by manager",
                // "Delete departments",
                // "Delete roles",
                // "Delete employees",
                // "View the total utilized budget of a department"
            ]
        }).then(answer => {
            switch (answer.action) {
                case "Add departments":
                    addDepartments();
                    break;

                case "Add roles":
                    addRoles();
                    break;

                case "Add employees":
                    addEmployees();
                    break;

                case "View departments, roles, and employees":
                    view();
                    break;

                case "Update employee roles":
                    updateRoles();
                    break;

                // case "Update employee managers":
                //     updateManagers();
                //     break;

                // case "View employees by manager":
                //     viewEmployeesByManager();
                //     break;

                // case "Delete departments":
                //     deleteDepartments();
                //     break;

                // case "Delete roles":
                //     deleteRoles();
                //     break;

                // case "Delete employees":
                //     deleteEmployees();
                //     break;

                // case "View the total utilized budget of a department":
                //     viewBudgetByDepartment();
                //     break;
            }
        });
};

addDepartments = () => {
    inquirer
        .prompt({
            name: "department",
            type: "input",
            message: "What department would you like to add?"
        }).then(answer => {
            connection.query("INSERT INTO department SET ?",
                {
                    name: answer.department,
                },
                err => {
                    if (err) throw err;
                    console.log("Your department was created successfully!");
                    start();
                }
            );
        });
}

addRoles = () => {
    // prompt for info about the item being put up for auction
    inquirer
        .prompt([
            {
                name: "title",
                type: "input",
                message: "What is the title of the role you would like to submit?"
            },
            {
                name: "salary",
                type: "input",
                message: "What is the salary of this role?",
                validate: value => {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "department_id",
                type: "input",
                message: "What department are they in? Sales=1, I.T.=2, Finance=3, Legal=4",
                validate: value => {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(answer => {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: answer.title,
                    salary: answer.salary || 0,
                    department_id: answer.department_id || 0,

                },
                err => {
                    if (err) throw err;
                    console.log("Your role was created successfully!");
                    // re-prompt the user for if they want to bid or post
                    start();
                }
            );
        });

};

addEmployees = () => {
    // prompt for info about the item being put up for auction
    inquirer
        .prompt([
            {
                name: "first_name",
                type: "input",
                message: "What is the first name?"
            },
            {
                name: "last_name",
                type: "input",
                message: "What is the last name?",

            },
            {
                name: "role_id",
                type: "input",
                message: "What is the employee's role id",
                validate: value => {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "manager_id",
                type: "input",
                message: "What is the employee's manager ID",
                validate: value => {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(answer => {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: answer.role_id || 0,
                    manager_id: answer.manager_id || 0,
                },
                err => {
                    if (err) throw err;
                    console.log("Your employee was created successfully!");
                    // re-prompt the user for if they want to bid or post
                    start();
                }
            );
        });

};

view = () => {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "Would you like to view?",
            choices: [
                "View departments",
                "View roles",
                "View employees",
            ]
        }).then(answer => {
            switch (answer.action) {
                case "View departments":
                    var query = "SELECT * FROM department";
                    connection.query(query, function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        start();
                    });
                    break;

                case "View roles":
                    var query = "SELECT * FROM role";
                    connection.query(query, function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        start();
                    });
                    break;

                case "View employees":
                    var query = "SELECT * FROM employee";
                    connection.query(query, function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        start();
                    });
                    break;




            };

        });
};

updateRoles = () => {
    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    message: "Whose role would you like to change?",
                    choices: function () {
                        var employeeChoice = [];
                        for (var i = 0; i < results.length; i++) {
                            employeeChoice.push(results[i].last_name);
                        }
                        return employeeChoice;
                    },

                },

            ])
            .then(function (answer) {
                inquirer
                    .prompt([
                        {
                            name: "roleID",
                            type: "input",
                            message: "What is the role ID number"
                        },
                    ]).then(function (answerTwo) {
                        connection.query("UPDATE employee SET role_id = ? WHERE last_name = ?", [answerTwo.roleID, answer.choice]);
                        console.log("Role Update Was a Success!");
                        start();
                    })
            })
    })
}
