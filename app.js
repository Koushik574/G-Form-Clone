import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const { Client } = pg;

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


const client = new Client({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'GFormDB',
  password: '1234',
  port: 5432, 
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Error connecting to PostgreSQL', err));


app.get('/', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM gform');
    const dataFromDB = result.rows;
    res.render('index', { dataFromDB });
  } catch (error) {
    console.error('Error querying PostgreSQL', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/submit', async (req, res) => {
  const { textField, checkbox, radio, dropdown } = req.body;

  try {
    
    await client.query('INSERT INTO gform (tf, cb, rb, dd) VALUES ($1, $2, $3, $4)', [textField, checkbox, radio, dropdown]);

    
    res.redirect('/');
  } catch (error) {
    console.error('Error inserting into PostgreSQL', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});