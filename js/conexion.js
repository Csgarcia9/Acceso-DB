const express = require('express');
const cors = require('cors');
const mysql  = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..'))); 

const connection = mysql.createConnection({
    host: '54.82.98.114',   
    user: 'cesdev',
    password: 'Cgb1003153006*',     
    database: 'REGISTROS',
    port: 3306
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            return;
        }
        console.log('Connected to the database!');
    }
);

app.get('/clientes', (req, res) => {
    
    connection.query('SELECT * FROM CLIENTES', (error, results) => {
        if (error) {
            
            console.error('Error fetching data:', error);
            res.status(500).send('Error fetching data');
            return;
        }
        res.json(results);
        
    });
});


app.post('/clientes', (req, res) => {
  const nuevoCliente = req.body;
  console.log('Servidor - Datos recibidos:', nuevoCliente);
  const sql = 'INSERT INTO CLIENTES SET ?';
  console.log('Servidor - SQL a ejecutar:', sql, nuevoCliente);
  connection.query(sql, nuevoCliente, (error, results) => {
    if (error) {
      console.error('Servidor - Error al insertar datos:', error);
      res.status(500).send('Error inserting data');
      return;
    }
    res.status(201).json({ id: results.insertId, ...nuevoCliente });
  });
});

app.put('/clientes/:id', (req, res) => {
  const clienteId = req.params.id;
  const updates = req.body; // Objeto con solo los campos que se desean actualizar

  if (Object.keys(updates).length === 0) {
    return res.status(200).send('No hay campos para actualizar');
  }

  const fieldsToUpdate = [];
  const values = [];

  for (const key in updates) {
    if (updates.hasOwnProperty(key)) {
      fieldsToUpdate.push(`${key} = ?`);
      values.push(updates[key]);
    }
  }

  const sql = `UPDATE CLIENTES SET ${fieldsToUpdate.join(', ')} WHERE ID = ?`;
  values.push(clienteId);

  connection.query(sql, values, (error, results) => {
    if (error) {
      console.error('Error updating client:', error);
      return res.status(500).send('Error updating client');
    }
    if (results.affectedRows > 0) {
      res.json({ message: 'Cliente actualizado' });
    } else {
      res.status(404).send('Cliente no encontrado');
    }
  });
});

app.delete('/clientes/:id', (req, res) => {
  const id = req.params.id;

  // Primero, verifica si el ID existe en la base de datos
  connection.query('SELECT ID FROM CLIENTES WHERE ID = ?', [id], (error, results) => {
    if (error) {
      console.error('Error al verificar la existencia del ID:', error);
      return res.status(500).send('Error al verificar la existencia del cliente');
    }

    // Si no se encontraron resultados, el ID no existe
    if (results.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Si el ID existe, procede con la eliminación
    connection.query('DELETE FROM CLIENTES WHERE ID = ?', [id], (error, deleteResults) => {
      if (error) {
        console.error('Error al eliminar el cliente:', error);
        return res.status(500).send('Error al eliminar el cliente');
      }

      // Si la eliminación fue exitosa (aunque affectedRows podría ser 0 si algo raro pasa)
      res.json({ message: 'Cliente eliminado' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
