-- Inserting data into our tables
INSERT INTO department(name)
VALUES
    ('Design'), 
    ('Engineering'), 
    ('Finance'), 
    ('Human Resources');

INSERT INTO role(title, salary, department_id )
VALUES
    ('UX Designer', 100000, 1), 
    ('Visual Designer', 10000, 1),
    ('Software Engineer', 160000, 2), 
    ('Accountant', 140000, 3),
    ('Human Resource Specialist',10000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
    ('Jackie', 'Lee', 1, NULL), 
    ('John', 'Doe', 2, 1), 
    ('John', 'Proctor', 3, NULL), 
    ('Giles', 'Corey', 4, 3),
    ('Jane', 'Doe', 4, NULL),
    ('Edward', 'Bishop',2, 5),
    ('Alice', 'Young', 3, NULL); 