# Node-Book-Mgmt

# Setting up the Project
    Clone the repository to your local machine
    Install necessary packages -> npm install

# Run Migrations and seeders ->
    Navigate to src folder
    Then run ->
        npx sequelize db:migrate
        npx seuqelize db:seed:all

        It will create a admin user ->
        email: book@test.com
        pass: Password@123    # password encryption is currently disabled


## Swagger Documentation
    URL = http://localhost:3000/api-docs/

## to Run
    npm run local

## Technology Used
    Node
    PostgreSQL
    Express.js
    Javascript
    Sequelize
