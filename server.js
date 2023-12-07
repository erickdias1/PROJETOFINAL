/*const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "633e6114a2a159",
      pass: "33aef0a28ce6f4"
    }
  });

  transport.sendMail({
    from: 'Erickao <633e6114a2a159>',
    to: 'erickkdias1999@gmail.com',
    subject: 'Enviando email testes',
    text: 'olá'
  })
  .then(() => console.log('Email enviado com sucesso'))
  .catch((err) => console.log('Erro ao enviar Email', err))*/

  const express = require('express');
  const nodemailer = require('nodemailer');
  const bodyParser = require('body-parser');
  const path = require('path');
  const sqlite3 = require('sqlite3').verbose();
  
  const app = express();
  const port = 3000;
  
  // Serve static files from the 'assets' directory
  app.use('/assets', express.static(path.join(__dirname, 'assets')));
  
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  // SQLite database setup
  const db = new sqlite3.Database('forms.db');
  
  // criando resposta se n existir
  db.run(`
    CREATE TABLE IF NOT EXISTS responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      email TEXT,
      telefone TEXT,
      preferencia TEXT,
      novidades BOOLEAN
    )
  `);
  
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
  
  app.get('/contato', (req, res) => {
    const filePath = path.join(__dirname, 'contato', 'index.html');
    console.log('Resolved path:', filePath);
    res.sendFile(filePath);
  });
  
  // Handle form submission
  app.post('/submit-form', (req, res) => {
    console.log('Body:', req.body);
    const { nome, email, telefone, preferencia, novidades } = req.body;
    console.log('Received form data:');
    console.log('Nome:', nome);
    console.log('Email:', email);
    console.log('Telefone:', telefone);
    console.log('Preferencia:', preferencia);
    console.log('Novidades:', novidades);
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "633e6114a2a159",
        pass: "33aef0a28ce6f4"
      }
    });
  
    const mailOptions = {
      from: 'Erickao <633e6114a2a159>',
      to: 'erickkdias1999@gmail.com',
      subject: 'Enviando email testes',
      text: `Nome: ${nome}\nEmail: ${email}\nTelefone: ${telefone}\nPreferência: ${preferencia}\nNovidades: ${novidades ? 'Sim' : 'Não'}`
    };
  
    transporter.sendMail(mailOptions)
      .then(() => {
        console.log('Email enviado com sucesso');
  
        // inserindo os dados no db
        const insertQuery = `
          INSERT INTO responses (nome, email, telefone, preferencia, novidades)
          VALUES (?, ?, ?, ?, ?)
        `;
  
        db.run(insertQuery, [nome, email, telefone, preferencia, novidades], (err) => {
          if (err) {
            console.error('Error inserting data into the database:', err);
            res.status(500).json({ success: false, error: 'Erro ao enviar o formulário' });
          } else {
            console.log('Data inserted into the database successfully');
            res.json({ success: true });
  
            // query para dar log no console
            const selectQuery = 'SELECT * FROM responses';
            db.all(selectQuery, (err, rows) => {
              if (err) {
                console.error('Error querying the database:', err);
              } else {
                console.log('Data from the database:');
                console.log(rows);
              }
  
              // fecha a conexão db
              db.close();
            });
          }
        });
      })
      .catch((err) => {
        res.status(500).json({ success: false, error: 'Erro ao enviar o formulário' });
        console.log('Erro ao enviar Email', err);
      });
  });
  
  // fecha a conexão db
  process.on('SIGINT', () => {
    db.close(() => {
      console.log('Database connection closed.');
      process.exit(0);
    });
  });
  
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
  
