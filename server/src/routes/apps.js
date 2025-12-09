const express = require('express');
const router = express.Router();
const PortfolioApp = require('../models/PortfolioApp');
const Plan = require('../models/Plan');
const AuditLog = require('../models/AuditLog');
const { Op } = require('sequelize');

// Utility to log changes
const logChange = async (entityId, action, changes, user = 'System') => {
  await AuditLog.create({
    entityType: 'App',
    entityId,
    action,
    changedBy: user,
    changes
  });
};

// GET all apps with filters
router.get('/', async (req, res) => {
  try {
    const { status, store, owner, search } = req.query;
    const whereClause = {};

    if (status) whereClause.status = status;
    if (store) whereClause.store = store;
    if (owner) whereClause.owner = { [Op.like]: `%${owner}%` };
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { updateIssue: { [Op.like]: `%${search}%` } }
      ];
    }

    const apps = await PortfolioApp.findAll({ 
      where: whereClause,
      include: Plan,
      order: [['id', 'DESC']]
    });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET one app
router.get('/:id', async (req, res) => {
  try {
    const app = await PortfolioApp.findByPk(req.params.id, { include: Plan });
    if (!app) return res.status(404).json({ error: 'App not found' });
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new app
router.post('/', async (req, res) => {
  try {
    console.log('Creating app with data:', JSON.stringify(req.body, null, 2));
    
    // Clean up undefined values
    const cleanData = Object.fromEntries(
      Object.entries(req.body).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    );
    
    console.log('Cleaned data:', JSON.stringify(cleanData, null, 2));
    
    const app = await PortfolioApp.create(cleanData);
    await logChange(app.id, 'CREATE', cleanData);
    console.log('App created successfully:', app.id);
    res.status(201).json(app);
  } catch (err) {
    console.error('Error creating app:', err);
    console.error('Error details:', err.errors || err.message);
    res.status(400).json({ error: err.message || 'Failed to create app' });
  }
});

// PUT update app
router.put('/:id', async (req, res) => {
  try {
    const app = await PortfolioApp.findByPk(req.params.id);
    if (!app) return res.status(404).json({ error: 'App not found' });
    
    const oldData = app.toJSON();
    await app.update(req.body);
    
    // Log meaningful changes
    const changes = {};
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== oldData[key]) {
        changes[key] = { from: oldData[key], to: req.body[key] };
      }
    });
    
    if (Object.keys(changes).length > 0) {
      await logChange(app.id, 'UPDATE', changes);
    }

    res.json(app);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE app
router.delete('/:id', async (req, res) => {
  try {
    const app = await PortfolioApp.findByPk(req.params.id);
    if (!app) return res.status(404).json({ error: 'App not found' });
    await app.destroy();
    res.json({ message: 'App deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

