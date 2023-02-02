# employee-tracker
an application that keeps track of your employees using a mysql database

## Description

This application is a employee tracker that lets user view all the departments, roles and employee's in our database. Users are also able to create new departments, roles and add new employee's to our database. Users are also able to update employee roles with this application. All data in the database will have a primary key that reference back to them in their respected table. Roles gives information like the salary employees are earning as well as which department they belong to. Employee table has information like first name, last name, role title as well as who the employee's manager is. 

What I learn from this project is the use of mysql queries and how to connect mysql to my javascript file. I also learn how to create a database using mysql files and adding seeds with sql files as well. I learned how to grab data in javscript from a mysql database and using that data to display information in console. 

## Installation

After cloning all the files from the respository you would need to install a few packages to be able to run this application. First you will need to install mysql into your computer. Then You would need node.js, mysql2.js, inquirer and console.table. With the included package.json file in the repository you would only need to run "npm install" after installing node.js into your local machine. 

## Usage
- install mysql
- install node.js
- install mysql2
- install inquirer
- install console.table
- run schema.sql and seeds.sql into mysql to load tables and seeds
- run index.js in the root folder
- go through the menu
- you can view employees, roles and departments which will then display a table with the corresponding data
- you can add department, employee, role which will prompt you some questions that you will have to answer
- after answering questions it will then add the data into our database
- you can also update an employee which will ask you which employee to update and which role you want to update to. 


[link to walk through video](https://drive.google.com/file/d/1MiOwDD7dqVtZZkpm7u2Oo7PwvApEbM-4/view)


## Credits

N/A

## License

N/A

---


## Features

Users are able to view mysql data via tables. Users are able to view the departments, roles and employees in this employee_db. Users are also able to add new employee, roles and departments. Users are also able to update employee roles. 