This is a part of the Demonstration for Data Service in SIM Master FH Frankfurt

# Setup
#### 1. Install necessary softwares and get example data

- Clone the project on github (or go to the link and download it)

        git clone https://github.com/ndthanh/SIM_Integration

- Install Nodejs

        http://nodejs.org/

- Install mySQL

        http://dev.mysql.com/downloads/

**The following 2 steps are optional because you already have the data in the Example Data folder in the project folder. In short: you can skip 
to 2. Setup**

- Get example data from BSCW

        https://bscw.fh-frankfurt.de/EduRes/pub/bscw.cgi/d2110963/Versand12EN.mdb

- Download and install the Bullzip software to convert access DB to mySQL

        http://www.bullzip.com/products/a2m/info.php



#### 2. Setup
- (Optional) Use the bullzip software to convert the **Versand12EN.mdb** to **Versand12EN.sql**
- Import **Versand12EN.sql** to your local mySQL Database
- Go to the project folder **SIM_integration** and install the dependencies. In terminal type:

        npm install

#### 3. Configuration

- Open **server.js** and change the following informations with your informations

        // file: server.js
        host: 'localhost',
        user: 'root',
        password : 'root',
        port : 3306, //port mysql
        database:'movedb'
        
#### 4. Start and test the service
- turn on your mySQL server if needed

- open up your terminal and go to the project folder then type in:

        node server.js

- on a browser, go to the address

        http://localhost:3000/api/user

#### 5. Operations overview

| Route              	| HTTP verb 	| Description           	|
|--------------------	|-----------	|--------------------------	|
| /api/user          	| GET       	| get All users            	|
| /api/user          	| POST      	| add new user             	|
| /api/user/:user_id 	| GET       	| get a user (for editing) 	|
| /api/user/:user_id 	| PUT       	| update a user            	|
| /api/user/:user_id 	| DELETE    	| delete a user         	|