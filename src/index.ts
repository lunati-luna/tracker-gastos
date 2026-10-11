import express from 'express';
import { pool } from './db';

const app = express();
app.use(express.json());

app.use(express.static('public'));

const PORT = 3000;

// Crear un gasto
app.post('/gastos', async (req, res) => {
  const { monto, categoria, descripcion, fecha } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO gastos (monto, categoria, descripcion, fecha) VALUES (?, ?, ?, ?)',
      [monto, categoria, descripcion, fecha]
    );
    res.status(201).json({ mensaje: 'Gasto creado', id: (result as any).insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el gasto' });
  }
});

// Listar todos los gastos
app.get('/gastos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM gastos ORDER BY fecha DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los gastos' });
  }
});

// Editar un gasto
app.put('/gastos/:id', async (req, res) => {
  const { id } = req.params;
  const { monto, categoria, descripcion, fecha } = req.body;

  try {
    await pool.query(
      'UPDATE gastos SET monto = ?, categoria = ?, descripcion = ?, fecha = ? WHERE id = ?',
      [monto, categoria, descripcion, fecha, id]
    );
    res.json({ mensaje: 'Gasto actualizado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el gasto' });
  }
});

// Borrar un gasto
app.delete('/gastos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM gastos WHERE id = ?', [id]);
    res.json({ mensaje: 'Gasto eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el gasto' });
  }
});

// Resumen por categoría
app.get('/gastos/resumen', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT categoria, SUM(monto) as total FROM gastos GROUP BY categoria'
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el resumen' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});