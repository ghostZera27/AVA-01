const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database('estoque.db');

// Criar tabela de produtos
db.prepare(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sku TEXT UNIQUE,
    price REAL NOT NULL DEFAULT 0,
    quantity INTEGER NOT NULL DEFAULT 0
  );
`).run();

// Seed inicial, se vazio
const row = db.prepare('SELECT COUNT(*) as c FROM products').get();
if (row.c === 0) {
  const seed = db.prepare('INSERT INTO products (name, sku, price, quantity) VALUES (?, ?, ?, ?)');
  seed.run('Arroz 5kg', 'ARZ-5KG', 24.9, 12);
  seed.run('Feijão 1kg', 'FEJ-1KG', 8.5, 30);
  seed.run('Açúcar 1kg', 'ACU-1KG', 5.2, 18);
  seed.run('Café 500g', 'CAF-500G', 17.3, 10);
  seed.run('Óleo 900ml', 'OLE-900', 6.7, 25);
  seed.run('Macarrão 500g', 'MAC-500G', 4.5, 20);
  console.log('Banco alimentado com produtos iniciais ✅');
}

// Helper para conversão segura
const toNumber = (v, d = 0) => (isNaN(Number(v)) ? d : Number(v));

// LISTAR todos os produtos
app.get('/products', (req, res) => {
  const list = db.prepare('SELECT * FROM products ORDER BY id DESC').all();
  res.json(list);
});

// OBTER produto específico
app.get('/products/:id', (req, res) => {
  const item = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(item);
});

// ADICIONAR produto
app.post('/products', (req, res) => {
  const { name, sku, price, quantity } = req.body || {};
  if (!name) return res.status(400).json({ error: 'O campo "name" é obrigatório' });

  try {
    const stmt = db.prepare('INSERT INTO products (name, sku, price, quantity) VALUES (?, ?, ?, ?)');
    const info = stmt.run(
      name.trim(),
      sku ? sku.trim() : null,
      toNumber(price, 0),
      parseInt(quantity ?? 0)
    );
    const created = db.prepare('SELECT * FROM products WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(created);
  } catch (e) {
    if (String(e).includes('UNIQUE constraint failed: products.sku')) {
      return res.status(409).json({ error: 'SKU já existe' });
    }
    res.status(500).json({ error: 'Erro ao criar produto', detail: String(e) });
  }
});

// ATUALIZAR produto
app.put('/products/:id', (req, res) => {
  const { name, sku, price, quantity } = req.body || {};
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Produto não encontrado' });

  try {
    const stmt = db.prepare('UPDATE products SET name=?, sku=?, price=?, quantity=? WHERE id=?');
    stmt.run(
      String(name ?? existing.name).trim(),
      sku !== undefined ? (sku ? String(sku).trim() : null) : existing.sku,
      toNumber(price ?? existing.price),
      parseInt(quantity ?? existing.quantity),
      req.params.id
    );
    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (e) {
    if (String(e).includes('UNIQUE constraint failed: products.sku')) {
      return res.status(409).json({ error: 'SKU já existe' });
    }
    res.status(500).json({ error: 'Erro ao atualizar produto', detail: String(e) });
  }
});

// DELETAR produto
app.delete('/products/:id', (req, res) => {
  const info = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json({ ok: true });
});

// Rodar servidor
const PORT = 3000;
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
