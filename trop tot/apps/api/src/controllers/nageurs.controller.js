const repo = require('../repositories/nageur.repo');

exports.list = async (req, res, next) => {
  try {
    const rows = await repo.findAll();
    res.json(rows);
  } catch (err) { next(err); }
};

exports.search = async (req, res, next) => {
  try {
    const q = req.query.q || '';
    const rows = await repo.searchByName(q);
    res.json(rows);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const row = await repo.findById(id);
    if (!row) return res.status(404).json({ error: 'not found' });
    res.json(row);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const created = await repo.create(req.body);
    res.status(201).json(created);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const updated = await repo.update(id, req.body);
    if (!updated) return res.status(404).json({ error: 'not found' });
    res.json(updated);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await repo.remove(id);
    res.json({ success: true });
  } catch (err) { next(err); }
};
