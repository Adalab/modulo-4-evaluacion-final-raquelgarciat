const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const server = express();

server.use(cors());
server.use(express.json({ limit: '25mb' }));

async function getConnection() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
  connection.connect();
  return connection;
}

const port = process.env.PORT || 4500;
server.listen(port, () => {
  console.log(`Server started at: http://localhost:${port}/`);
});

server.get('/recetas/', async (req, res) => {
    const select = 'select * from recetas';
    const conn = await getConnection();
    const [results] = await conn.query(select);
    numOfElements = results.length;
    conn.end();
    res.json({
        "info": { "count": numOfElements},
        "results": results
        });
  });

server.get('/recetas/:id', async (req, res) => {
  const id = req.params.id;
  const select = 'select * from recetas where id = ?';
  const conn = await getConnection();
  const [results] = await conn.query(select, id);
  numOfElements = results.length;
  conn.end();
  res.json({
    "info": { "count": numOfElements},
    "results": results
    });
});

server.post('/recetas/', async (req, res) => {
    try {
    const newRecipe = req.body;
    const insert =
      'INSERT INTO recetas (nombre, ingredientes, instrucciones) VALUES (?,?,?)';
    const conn = await getConnection();
    const [results] = await conn.query(insert, [
      newRecipe.nombre,
      newRecipe.ingredientes,
      newRecipe.instrucciones,
    ]);
    const nuevo_id = results.insertId;
    conn.end();
    res.json({
      success: true,
      "id": nuevo_id
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Ha habido un error, hoy no comes, se siente.",
    });
  }
});

server.put('/recetas/:id', async (req, res) => {
  const id = req.params.id;
  const { nameFront, ingFront, instFront} = req.body;
  try {
    const update =
      'UPDATE recetas SET nombre= ?, ingredientes= ?, instrucciones= ? WHERE id = ?';
    const conn = await getConnection();
    const [results] = await conn.query(update, [
      nameFront,
      ingFront,
      instFront,
      id,
    ]);
    conn.end();
    res.json({
      success: true,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Ha habido un error, hoy no comes, se siente.",
    });
  }
});

server.delete('/recetas/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const deleteSql = 'DELETE FROM recetas WHERE id = ?';
    const conn = await getConnection();
    const [results] = await conn.query(deleteSql, id);
    conn.end();
    res.json({
      success: true,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Ha habido un error, hoy no comes, se siente.",
    });
  }
});