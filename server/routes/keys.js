const express = require('express');
const uuid = require('uuid/v4');

const { Project } = require('../models');
const { requireAuth } = require('./middleware');

const router = express.Router({ mergeParams: true });

router.get('/', (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true }, (err2, project) => {
  if (err2 || !project) {
    return res.status(404).json({ message: `Can't find project with id ${req.params.PROJECT_ID}!`, err2 });
  }
  return res.json({ readKeys: project.readKeys, writeKeys: project.writeKeys, masterKeys: project.masterKeys });
}));

router.get('/:KEY', (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true }, (err2, project) => {
  if (err2 || !project) {
    return res.status(404).json({ message: `Can't find project with id ${req.params.PROJECT_ID}!`, err2 });
  }
  if (project.readKeys.includes(req.params.key)) return res.json({ type: 'read' });
  if (project.writeKeys.includes(req.params.key)) return res.json({ type: 'write' });
  if (project.masterKeys.includes(req.params.key)) return res.json({ type: 'master' });
  return res.status(404).json({
    message: `Can't find key ${req.params.KEY} in project with id ${req.params.PROJECT_ID}!`,
    err: err2,
  });
}));

router.post('/regenerate', requireAuth, (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, (err2, project) => {
  if (err2 || !project) {
    return res.status(404).json({ message: `Can't find project with id ${req.params.PROJECT_ID}!`, err2 });
  }
  const { readKey, writeKey, masterKey } = req.body;
  if (!readKey && !writeKey && !masterKey) return res.status(403).json({ message: 'No key sent!' });
  if (readKey) {
    if (project.readKeys.includes(readKey)) {
      const newKey = uuid();
      project.readKeys[project.readKeys.indexOf(readKey)] = newKey;
      project.markModified('readKeys');
      return project.save((err3) => {
        if (err3) return res.status(500).json({ message: 'Internal server error!', err: err3 });
        return res.status(207).json({ mesasage: 'Key successfully created!', readKey: newKey });
      });
    }
  }
  if (writeKey) {
    if (project.writeKeys.includes(writeKey)) {
      const newKey = uuid();
      project.writeKeys[project.writeKeys.indexOf(writeKey)] = newKey;
      project.markModified('writeKeys');
      return project.save((err3) => {
        if (err3) return res.status(500).json({ message: 'Internal server error!', err: err3 });
        return res.status(207).json({ mesasage: 'Key successfully created!', writeKey: newKey });
      });
    }
  }
  if (masterKey) {
    if (project.masterKeys.includes(masterKey)) {
      const newKey = uuid();
      project.masterKeys[project.masterKeys.indexOf(masterKey)] = newKey;
      project.markModified('masterKeys');
      return project.save((err3) => {
        if (err3) return res.status(500).json({ message: 'Internal server error!', err: err3 });
        return res.status(207).json({ mesasage: 'Key successfully created!', masterKey: newKey });
      });
    }
  }
  return res.status(500).json({ message: 'Internal server error!' });
}));

router.post('/', (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, (err2, project) => {
  if (err2 || !project) {
    return res.status(404).json({ message: `Can't find project with id ${req.params.PROJECT_ID}!`, err2 });
  }
  const { readKey, writeKey, masterKey } = req.body;
  if (!readKey && !writeKey && !masterKey) return res.status(403).json({ message: 'No key sent!' });
  if (readKey) {
    if (project.readKeys.includes(readKey)) {
      return res.json({ message: `Key ${readKey} already exists!` });
    }
    project.readKeys.push(readKey);
    return project.save((err3) => {
      if (err3) return res.status(500).json({ message: 'Internal server error!', err: err3 });
      return res.status(201).json({ message: 'Key successfully created!' });
    });
  }
  if (writeKey) {
    if (project.writeKeys.includes(writeKey)) {
      return res.json({ message: `Key ${writeKey} already exists!` });
    }
    project.writeKeys.push(writeKey);
    return project.save((err3) => {
      if (err3) return res.status(500).json({ message: 'Internal server error!', err: err3 });
      return res.status(201).json({ message: 'Key successfully created!' });
    });
  }
  if (masterKey) {
    if (project.masterKeys.includes(masterKey)) {
      return res.json({ message: `Key ${masterKey} already exists!` });
    }
    project.masterKeys.push(masterKey);
    return project.save((err3) => {
      if (err3) return res.status(500).json({ message: 'Internal server error!', err: err3 });
      return res.status(201).json({ message: 'Key successfully created!' });
    });
  }
  return res.status(500).json({ message: 'Internal server error!' });
}));

router.delete('/:KEY', (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, (err2, project) => {
  if (err2 || !project) {
    return res.status(404).json({ message: `Can't find project with id ${req.params.PROJECT_ID}!`, err2 });
  }
  const key = req.params.KEY;
  if (!key) return res.status(403).json({ message: 'No key sent!' });
  if (project.readKeys.includes(key)) project.readKeys.splice(project.readKeys.indexOf(key), 1);
  if (project.writeKeys.includes(key)) project.writeKeys.splice(project.writeKeys.indexOf(key), 1);
  if (project.masterKeys.includes(key)) project.masterKeys.splice(project.masterKeys.indexOf(key), 1);
  return project.save((err3) => {
    if (err3) return res.status(500).json({ message: 'Internal server error!' });
    return res.status(201).json({ message: 'Key successfully deleted!' });
  });
}));

module.exports = router;
