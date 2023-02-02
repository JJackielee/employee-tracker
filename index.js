const inquirer = require("inquirer");
const mysql = require('mysql2');



const init = async () => {
    inquirer.prompt({
        type:"list",
        message:"What would you like to do?",
        name:"option",
        choices: ["View All Employees","Add Employee","Update Employee Role","View All Roles","Add Role","View All Departments", "Add Department","Quit"],
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
                return;
        }
    }) 
}


const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'jackie',
      database: 'employee_db'
    },
    console.log(`Connected to the books_db database.`)
);


function getDepartments(){
    db.query('SELECT * FROM department', function (err, results) {
       console.table(results);
       init();
      });
}
    
function getEmployees(){
    db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary FROM employee JOIN role ON role_id = role.id JOIN department ON department_id = department.id', function (err, results) {
        console.table(results);
        init();
      }); 
}

function getRole(){
    db.query('SELECT role.title, role.id, department.name, role.salary FROM role JOIN department on department_id = department.id', function (err, results) {
        console.table(results);
        init();
    });
}

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
                    console.log(results[0].id);
                    const employeeName = response.employeeSelected.split(" ");
                    console.log(employeeName);
                    db.query("UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?",[results[0].id,employeeName[0],employeeName[1]], function (err,res){
                        init();
                    });
                });
     
            });   
            
        });
    });
    

    
   

    

    
}

init();