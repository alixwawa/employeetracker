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

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    trackEmployee();
  });

  trackEmployee = () => {
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
        "View departments",
        "View roles",
        "View employees",
        "Update employee roles",
        "Update employee managers",
        "View employees by manager",
        "Delete departments",
        "Delete roles",
        "Delete employees",
        "View the total utilized budget of a department"        
      ]
    }).then(function(answer) {
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
  
        case "View departments":
          viewDepartments();
          break;
  
        case "View roles":
          viewRoles();
          break;

        case "View employees":
          viewEmployees();
          break;
  
        case "Update employee roles":
          updateRoles();
          break;
  
        case "Update employee managers":
          updateManagers();
          break;
  
        case "View employees by manager":
          viewEmployeesByManager();
          break;
  
        case "Delete departments":
          deleteDepartments();
          break;

        case "Delete roles":
          deleteRoles();
          break;
  
        case "Delete employees":
          deleteEmployees();
          break;
  
        case "View the total utilized budget of a department":
          viewBudgetByDepartment();
          break;
        }
      });
  };