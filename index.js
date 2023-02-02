//application uses inquirer and mysql2 and console.table
const inquirer = require("inquirer");
const mysql = require('mysql2');
const cTable = require('console.table');


//function to inituate inquirer that ask what the user wants to do. Inquirer uses a list that gives user choices.
//then uses a switch to determine which funtion to execute depending on the users answers
function init() {
    inquirer.prompt({
        type:"list",
        message:"What would you like to do?",
        name:"option",
        choices: ["View All Employees","View All Roles","View All Departments","Update Employee Role","Add Employee","Add Role", "Add Department","Quit"],
    }).then(response =>{
        switch(response.option) {
            case "View All Employees":
                getEmployees();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Update Employee Role":
                updateEmployee();
                break;
            case "View All Roles":
                getRole();
                break;
            case  "Add Role":
                addRole();
                break;
            case "View All Departments":
                 getDepartments();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Quit":
                process.exit();
        }
    }) 
}
//creates a connection with the mysql database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'jackie',
      database: 'employee_db'
    },
    console.log(`Connected to the books_db database.`)
);
//getDepartments function that uses a query to get data back from our mysql database. 
//query will grab all columns in the department table and we print it out with console.table
//uses the init() as a recursive function so users can go back to the menu and select again.
function getDepartments(){
    db.query('SELECT * FROM department ORDER BY department.id', function (err, results) {
       console.table(results);
       init();
      });
}
//getEmployees function that uses a query to get data back from our mysql database
//query will select id, first name, last name, role title, department name salary and manager name.
// it also joines two tables with role ids and department id to connect data together. 
//uses init function so user can go back to the menu and select again.
function getEmployees(){
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name,' ',manager.last_name) AS manager FROM employee JOIN role ON role_id = role.id JOIN department ON department_id = department.id  LEFT JOIN employee manager ON manager.id = employee.manager_id ORDER BY employee.id`, function (err, results) {
        console.table(results);
        init();
      }); 
}

//getRole function that uses a query to get data back from mysql
//query will select role title, role id, department name, and salary of all the roles.
//it also joins the depertmant database so we know which department title each role is in.
//uses init function to return to menu.
function getRole(){
    db.query('SELECT role.id, role.title, department.name, role.salary FROM role JOIN department on department_id = department.id ORDER BY role.id', function (err, results) {
        console.table(results);
        init();
    });
}

//addDepartment function that uses inquirer to ask user to name the department they want to add
//then uses mysql query to insert the new department into the db with the response in inquirer
//uses init function to return to menu after
function addDepartment(){
    inquirer.prompt({
        type:"input",
        message:"what is the name of the department?",
        name: "name",
    }).then(response =>{
        db.query('INSERT INTO department(name) VALUE(?)',[response.name], function (err, results){});
        init();
    })     
}

//addrole function that first uses a query to get the names of all the department in our department database
//inquirer asked users for the name of role they want to add and the salary of the role
//then it list out the departments in our database to have user select which department they are adding the role for
//uses query again to search for the role id in our department database with the department name
//then uses query again to add our new role into the role database with the retrieved department id. 
//uses init function to return to menu after
function addRole(){

    const deptList = []
    db.query("SELECT name FROM department", function (err, results){
        for(let result of results){
            deptList.push(result.name);
        }
    });

    inquirer.prompt([{
        type:"input",
        message:"what is the name of the role",
        name: "name",
    },
    {
        type:"input",
        message:"what is the salary of the role",
        name: "salary",
    },{
        type:"list",
        message:"Which department does the role belong to?",
        name: "department",
        choices: deptList,
        
    }]).then(response =>{
        db.query("SELECT id FROM department WHERE name = ?", [response.department], function (err,results){
            db.query("INSERT INTO role (title, salary, department_id ) VALUES (?,?,?)",[response.name, response.salary, results[0].id], function (err, res){
                init();
            });
    
        });
    })   
}

//addEmployee Function that first uses querys to get a list of name of the roles in our roles database as well as a list of the name of employees in our employee database
//use inquier to ask for first name, last name and then list out all the possible roles and the possible managers our new employee will have so our uses can choose. 
//then we use query again to grab the role_id of the role our user selected as well the the employee_id the user selected as the manager.
//if user selected none for the manager then the employee_id will be null
//uses query to insert the new employee into our database with the information we grabbed from query and inquierer
//uses init to reutn to menu after
function addEmployee(){
    const roleList = []
    db.query("SELECT title FROM role", function (err, results){
        for(let result of results){
            roleList.push(result.title);
        }
        
    });

    const employeeList = ["None"]
    db.query("SELECT * FROM employee", function (err, results){
        for(let result of results){
            employeeList.push(result.first_name + " " + result.last_name);
        }
    });

    inquirer.prompt([{
        type:"input",
        message:"What is the employee's first name?",
        name: "firstName",
    },
    {
        type:"input",
        message:"What is the employee's last name?",
        name: "lastName",
    },{
        type:"list",
        message:"What is the employee's role?",
        name: "role",
        choices: roleList,
        
    },{
        type:"list",
        message:"Who is the employee's manager?",
        name: "manager",
        choices: employeeList,
        
    }
    ]).then(response =>{
        db.query("SELECT id FROM role WHERE title = ?", [response.role], function (err,results){
            const managerName = response.manager.split(" ");
           
            db.query("SELECT id FROM employee WHERE first_name = ? AND last_name = ?", [managerName[0], managerName[1]], function (err, res){
                let managerId = 0;
                if(response.manager != "None"){
                    managerId = res[0].id; 
                } else {
                    managerId= null;
                }
                db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id ) VALUES (?,?,?,?)",[response.firstName, response.lastName, results[0].id,managerId], function (err, res){
                    init();
                });
            });
    
        });
    })   
}

//updateEmployee function that first uses query to get a list of names of all the employee as well as all the roles in our databases
//then uses inquirer to list out which employee user want to update and which role user want to update the employee too
//uses query again to find role ID and then uses query again to UPDATE our database by using paremeter to match the cell we're trying to update
function updateEmployee(){
    const employeeList = []
    const roleList = []
    db.query("SELECT * FROM employee", function (err, results){
        for(let result of results){
            employeeList.push(result.first_name + " " + result.last_name);
        }
        db.query("SELECT title FROM role", function (err, results){
            for(let result of results){
                roleList.push(result.title);
            }
            inquirer.prompt([{
                type:"list",
                message:"Which employee's role do you want to update?",
                name: "employeeSelected",
                choices: employeeList,
            },
            {
                type:"list",
                message:"Which role do you want to assign the selected employee?",
                name: "roleSelected",
                choices: roleList,
            }
            ]).then(response =>{
                db.query("SELECT id FROM role WHERE title = ?", [response.roleSelected], function (err,results){
                    const employeeName = response.employeeSelected.split(" ");
                    db.query("UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?",[results[0].id,employeeName[0],employeeName[1]], function (err,res){
                        init();
                    });
                });
     
            });   
            
        });
    });
    

    
   

    

    
}

init();