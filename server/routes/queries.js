const express = require('express');
const Drpcjs = require('drpcjs');
const cassandra = require('cassandra-driver');

const { Project } = require('../models');
const { requireAuth } = require('./middleware');

const router = express.Router({ mergeParams: true });
const drpc = new Drpcjs({ host: process.env.DRPC_URL });
const client = new cassandra.Client({ contactPoints: [process.env.CASSANDRA_URL], keyspace: 'cenote', localDataCenter: 'datacenter1' });
client.connect(console.error);

router.get('/count', (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true }, (err2, project) => {
  if (err2 || !project) {
    return res.status(404).json({ message: `Can't find project with id ${req.params.PROJECT_ID}!`, err2 });
  }
  const { readKey, masterKey, event_collection } = req.query;
  if (!readKey && !masterKey) return res.status(403).json({ error: 'No key credentials sent!' });
  if (!event_collection) return res.status(400).json({ error: 'No `event_collection` param provided!' });
  if (!(readKey === project.readKey || masterKey === project.masterKey)) return res.status(401).json({ message: 'Key hasn\'t authorization' });
  return drpc.execute('read', JSON.stringify({ ...req.query, ...req.params, query_type: 'count' }))
    .then(answer => res.json(JSON.parse(answer)))
    .catch(err3 => res.status(404).json({ message: 'Can\'t execute query!', err: err3 }));
}));

router.get('/count_unique', (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true }, (err2, project) => {
  if (err2 || !project) {
    return res.status(404).json({ message: `Can't find project with id ${req.params.PROJECT_ID}!`, err2 });
  }
  const { readKey, masterKey, event_collection, target_property } = req.query;
  if (!readKey && !masterKey) return res.status(403).json({ error: 'No key credentials sent!' });
  if (!event_collection) return res.status(400).json({ error: 'No `event_collection` param provided!' });
  if (!target_property) return res.status(400).json({ error: 'No `target_property` param provided!' });
  if (!(readKey === project.readKey || masterKey === project.masterKey)) return res.status(401).json({ message: 'Key hasn\'t authorization' });
  return drpc.execute('read', JSON.stringify({ ...req.query, ...req.params, query_type: 'count_unique' }))
    .then(answer => res.json(JSON.parse(answer)))
    .catch(err3 => res.status(404).json({ message: 'Can\'t execute query!', err: err3 }));
}));

router.get('/minimum', (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true }, (err2, project) => {
  if (err2 || !project) {
    return res.status(404).json({ message: `Can't find project with id ${req.params.PROJECT_ID}!`, err2 });
  }
  const { readKey, masterKey, event_collection, target_property } = req.query;
  if (!readKey && !masterKey) return res.status(403).json({ error: 'No key credentials sent!' });
  if (!event_collection) return res.status(400).json({ error: 'No `event_collection` param provided!' });
  if (!target_property) return res.status(400).json({ error: 'No `target_property` param provided!' });
  if (!(readKey === project.readKey || masterKey === project.masterKey)) return res.status(401).json({ message: 'Key hasn\'t authorization' });
  return drpc.execute('read', JSON.stringify({ ...req.query, ...req.params, query_type: 'min' }))
    .then(answer => res.json(JSON.parse(answer)))
    .catch(err3 => res.status(404).json({ message: 'Can\'t execute query!', err: err3 }));
}));

router.get('/maximum', (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true }, (err2, project) => {
  if (err2 || !project) {
    return res.status(404).json({ message: `Can't find project with id ${req.params.PROJECT_ID}!`, err2 });
  }
  const { readKey, masterKey, event_collection, target_property } = req.query;
  if (!readKey && !masterKey) return res.status(403).json({ error: 'No key credentials sent!' });
  if (!event_collection) return res.status(400).json({ error: 'No `event_collection` param provided!' });
  if (!target_property) return res.status(400).json({ error: 'No `target_property` param provided!' });
  if (!(readKey === project.readKey || masterKey === project.masterKey)) return res.status(401).json({ message: 'Key hasn\'t authorization' });
  return drpc.execute('read', JSON.stringify({ ...req.query, ...req.params, query_type: 'max' }))
    .then(answer => res.json(JSON.parse(answer)))
    .catch(err3 => res.status(404).json({ message: 'Can\'t execute query!', err: err3 }));
}));

router.get('/sum', (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true }, (err2, project) => {
  if (err2 || !project) {
    return res.status(404).json({ message: `Can't find project with id ${req.params.PROJECT_ID}!`, err2 });
  }
  const { readKey, masterKey, event_collection, target_property } = req.query;
  if (!readKey && !masterKey) return res.status(403).json({ error: 'No key credentials sent!' });
  if (!event_collection) return res.status(400).json({ error: 'No `event_collection` param provided!' });
  if (!target_property) return res.status(400).json({ error: 'No `target_property` param provided!' });
  if (!(readKey === project.readKey || masterKey === project.masterKey)) return res.status(401).json({ message: 'Key hasn\'t authorization' });
  return drpc.execute('read', JSON.stringify({ ...req.query, ...req.params, query_type: 'sum' }))
    .then(answer => res.json(JSON.parse(answer)))
    .catch(err3 => res.status(404).json({ message: 'Can\'t execute query!', err: err3 }));
}));

router.get('/average', (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true }, (err2, project) => {
  if (err2 || !project) {
    return res.status(404).json({ message: `Can't find project with id ${req.params.PROJECT_ID}!`, err2 });
  }
  const { readKey, masterKey, event_collection, target_property } = req.query;
  if (!readKey && !masterKey) return res.status(403).json({ error: 'No key credentials sent!' });
  if (!event_collection) return res.status(400).json({ error: 'No `event_collection` param provided!' });
  if (!target_property) return res.status(400).json({ error: 'No `target_property` param provided!' });
  if (!(readKey === project.readKey || masterKey === project.masterKey)) return res.status(401).json({ message: 'Key hasn\'t authorization' });
  return drpc.execute('read', JSON.stringify({ ...req.query, ...req.params, query_type: 'average' }))
    .then(answer => res.json(JSON.parse(answer)))
    .catch(err3 => res.status(404).json({ message: 'Can\'t execute query!', err: err3 }));
}));

router.get('/median', (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true }, (err2, project) => {
  if (err2 || !project) {
    return res.status(404).json({ message: `Can't find project with id ${req.params.PROJECT_ID}!`, err2 });
  }
  const { readKey, masterKey, event_collection, target_property } = req.query;
  if (!readKey && !masterKey) return res.status(403).json({ error: 'No key credentials sent!' });
  if (!event_collection) return res.status(400).json({ error: 'No `event_collection` param provided!' });
  if (!target_property) return res.status(400).json({ error: 'No `target_property` param provided!' });
  return drpc.execute('read', JSON.stringify({ ...req.query, ...req.params, query_type: 'median' }))
    .then(answer => res.json(JSON.parse(answer)))
    .catch(err3 => res.status(404).json({ message: 'Can\'t execute query!', err: err3 }));
}));

router.get('/percentile', (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true }, (err2, project) => {
  if (err2 || !project) {
    return res.status(404).json({ message: `Can't find project with id ${req.params.PROJECT_ID}!`, err2 });
  }
  const { readKey, masterKey, event_collection, target_property, percentile } = req.query;
  if (!readKey && !masterKey) return res.status(403).json({ error: 'No key credentials sent!' });
  if (!event_collection) return res.status(400).json({ error: 'No `event_collection` param provided!' });
  if (!target_property) return res.status(400).json({ error: 'No `target_property` param provided!' });
  if (!percentile) return res.status(400).json({ error: 'No `percentile` param provided!' });
  return drpc.execute('read', JSON.stringify({ ...req.query, ...req.params, query_type: 'percentile' }))
    .then(answer => res.json(JSON.parse(answer)))
    .catch(err3 => res.status(404).json({ message: 'Can\'t execute query!', err: err3 }));
}));

router.get('/select_unique', (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true }, (err2, project) => {
  if (err2 || !project) {
    return res.status(404).json({ message: `Can't find project with id ${req.params.PROJECT_ID}!`, err2 });
  }
  const { readKey, masterKey, event_collection, target_property } = req.query;
  if (!readKey && !masterKey) return res.status(403).json({ error: 'No key credentials sent!' });
  if (!event_collection) return res.status(400).json({ error: 'No `event_collection` param provided!' });
  if (!target_property) return res.status(400).json({ error: 'No `target_property` param provided!' });
  return drpc.execute('read', JSON.stringify({ ...req.query, ...req.params, query_type: 'select_unique' }))
    .then(answer => res.json(JSON.parse(answer)))
    .catch(err3 => res.status(404).json({ message: 'Can\'t execute query!', err: err3 }));
}));

router.get('/extraction', (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true }, (err2, project) => {
  if (err2 || !project) {
    return res.status(404).json({ message: `Can't find project with id ${req.params.PROJECT_ID}!`, err2 });
  }
  const { readKey, masterKey, event_collection, target_property, latest } = req.query;
  if (!readKey && !masterKey) return res.status(403).json({ error: 'No key credentials sent!' });
  if (!event_collection) return res.status(400).json({ error: 'No `event_collection` param provided!' });
  const query = `SELECT ${target_property || '*'} FROM cenote.${req.params.PROJECT_ID}_${event_collection} ${latest ? `LIMIT ${latest}` : ''}`;
  const answer = [];
  return client.stream(query)
    .on('readable', function readable() {
      let row = this.read();
      while (row) {
        answer.push(row);
        row = this.read();
      }
    })
    .on('end', () => res.json({ ok: true, msg: answer }))
    .on('error', err3 => res.status(404).json({ message: 'Can\'t execute query!', err: err3 }));
}));

router.get('/collections', requireAuth, (req, res) => drpc.execute('read', JSON.stringify({ ...req.query, ...req.params, query_type: 'collections' }))
  .then(answer => res.json(JSON.parse(answer).msg))
  .catch(err3 => res.status(404).json({ message: 'Can\'t execute query!', err: err3 })));

module.exports = router;
