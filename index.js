const inquirer = require("inquirer");

//initiate an async function that ask the users for the option with inquirer. Then using whatever is returned to initiate the approiate action. 
const init = async () => {
      const selected = await getOptions();
      await selectedOptions(selected);

}

//async function that ask users with inquirer what they want to do. returns the selected choice. 
async function getOptions(){
    const managerInfo = await inquirer.prompt ([
        {
            type:"list",
            message:"What would you like to do?",
            name:"option",
            choices: ["View All Employees","Add Employee","Update Employee Role","View All Roles","Add Role","View All Departments", "Add Department","Quit"],
        }
    ]) 
    return managerInfo.option;
}

//add switch case here
async function selectedOptions(selected){
    console.log(selected);
    switch(selected) {
        case "View All Employees":
            //
            break;
        case "Add Employee":
            //
            break;
        case "Update Employee Role":
            //
            break;
        case "View All Roles":
            //
            break;
        case  "Add Role":
            //
            break;
        case "View All Departments":
            //
            break;
        case "Add Department":
            //
            break;
        case "Quit":
            return;
    }
}

init();