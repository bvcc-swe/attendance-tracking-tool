1.  **Make sure you have the .env file with the Database Connection string**
    

DATABASE\_URL=DatabaseConnectionString(Neon)

2.   **Run the backend locally**
    

\# from server/

RUN:

node index.js

YOU SHOULD SEE THIS:

Server listening on http://localhost:6060

Connected to PostgreSQL. Server time: 

Users table created or verified.

1.   **Make sure API is working**
    

Run:

curl http://localhost:6060/

Should see:

'Hello from the server!'

1.   **Insert one student manually**
    

curl -X POST http://localhost:6060/users \\

     -H "Content-Type: application/json" \\

     -d '{

           "name": "Alice Example",

           "email": "alice@example.com",

           "university": "auc",

           "track": "software engineering",

           "major": "computer science",

           "classification": "junior",

           "attendance\_count": 3

         }'

### **4.2 Retrieve all students**

curl http://localhost:6060/users | jq

_**(In a different terminal you can run node testQueries.js, to see the grouped versions of all the students as well.)**_