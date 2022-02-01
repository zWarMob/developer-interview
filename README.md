# 🧙‍♂️ Install Wizzard
 1. Install all dependencies:
```
npm ci
```

 2. Create this database locally:
(or edit the connection string in index.js) 
```
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'heylink'
```

 3. Run `transaction.sql`<br/><br/>

 4. Run the server
 ```
 node index.js
 ```

 5. Create a payment note with a POST request to `/payment-note`

 6. Go to http://localhost:5000/payment-note

 7. Use the id of the payment note from previous request in `http://localhost:5000/payment-note/392e8461-afed-42a0-b0b4-b41d1f16f482/transactions`

# 🤔 Questions

1. What do you see as potential issues, if the volume of transactions per payment note is ever increasing?
    -   The more data we get, the slower the database operations to look up data. Should add indexes to the columns we filter on
    -   Maybe use a persistent connection. Or MySQL documentation suggests using a connection pool to reduce overhead from creating connections. Right now for each request to the API, a connection to the database is being opened
    -   I would have suggested a queue system if the order of the notes did not matter, but right now I can't see how it would be of help.<br><br>

2. If you had the option to choose any tech-stack & service(s) to help scale up the handling of an ever increasing volume of transactions, which would you choose & how would each chosen option help?
    - Node runs on a single thread but that shouldn't be a problem as it only passes data to relevant services. And if really needed, I've heard multiple node instances can be launched and each used as a thread.
    - SQL database as we have structured data with specific requirements to it and it's values <br><br>

 3. (2.1.) Would the chosen options change the architecture of the code written for this task? If so, explain briefly what would change.
    - Does this question mean that you know of a stack that is fast and my answer on 2 is wrong? 💀💀 