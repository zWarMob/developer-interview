const bodyParser = require('body-parser');
const mysql = require('mysql');
const uuid = require('uuid');
const express = require('express');
const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'heylink'
});

// Create payment-note
app.post('/payment-note', (req,res) => {
    let id = uuid.v4();
    let paymentNoteCreateQuery = `INSERT INTO \`heylink\`.\`payment_note\` 
    (\`payment_note_uuid\`, \`payment_note_period_from_datetime\`, \`payment_note_period_to_datetime\`) 
    VALUES ('${id}', '${req.body.periodFrom}', '${req.body.periodTo}');`;

    connection.query(paymentNoteCreateQuery, (error) => {
        // return to API user
        if (error) res.send(500); 
        res.send(200);
        
        // mark transactions
        let transactionUpdateQuery = `UPDATE transaction
		SET transaction_payment_note_uuid = '${id}', transaction_status_code = 'PAID'
		WHERE transaction_status_code = 'PENDING'
		AND transaction_datetime BETWEEN '${req.body.periodFrom}' AND '${req.body.periodTo}';`;
        connection.query(transactionUpdateQuery, function (error) {
            if (error) console.log("Notify devs? 🔥 Something has gone horribly wrong 💀")
        
            // complete payment_note
            let transactionUpdateQuery = `UPDATE payment_note pn
            INNER JOIN (
                SELECT transaction_payment_note_uuid, SUM(transaction_value) as total, COUNT(*) as count
                FROM transaction
                WHERE transaction_payment_note_uuid = '${id}'
                GROUP BY transaction_payment_note_uuid
            ) t ON pn.payment_note_uuid = t.transaction_payment_note_uuid
            SET pn.payment_note_transactions_count = t.total, pn.payment_note_value = t.count, pn.payment_note_status_code = 'COMPLETED';`;
            connection.query(transactionUpdateQuery, (error) => {
                if (error) console.log("Notify devs? 🔥 Something has gone horribly wrong 💀")
            });
        });
    });
});

// Get all payment-notes
app.get('/payment-note', (req,res) => {
    connection.query('SELECT * FROM payment_note', function (error, results, fields) {
        if (error) res.send(500); 
        res.send(results);
    });
});

// Get all payment-note transactions
app.get('/payment-note/:uuid/transactions', (req,res) => {
    connection.query(`SELECT * FROM transaction WHERE transaction_payment_note_uuid = '${req.params.uuid}'`, function (error, results, fields) {
        if (error) res.send(500); 
        res.send(results);
    });
});

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});