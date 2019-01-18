const express = require('express');
const { Producer } = require('sinek');
const uuid = require('uuid/v4');

const { Project } = require('../models');

const router = express.Router({ mergeParams: true });
const config = { zkConStr: '83.212.104.172:2181,83.212.96.15:2181,83.212.104.177:2181' };
const producer = new Producer(config, ['cenoteIncoming'], 15);
producer.on('error', console.error);
producer.connect();

router.post('/:EVENT_COLLECTION', (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID },
  {}, { lean: true }, (err2, project) => {
    if (err2 || !project) {
      return res.status(404).json({ message: `Can't find project with id ${req.params.PROJECT_ID} in ${req.params.ORG_NAME}!`, err2 });
    }
    const { writeKey, masterKey } = req.query;
    if (!writeKey && !masterKey) return res.status(403).json({ error: 'No key credentials sent!' });
    if (!(writeKey === project.writeKey || masterKey === project.masterKey)) {
      return res.status(401).json({ message: 'Key hasn\'t authorization' });
    }
    const { data, timestamp } = req.body;
    if (!data) return res.status(400).json({ error: 'No data sent!' });
    const cenote = {
      created_at: Date.now(),
      id: uuid(),
      url: `/projects/${req.params.PROJECT_ID}/events/${req.params.EVENT_COLLECTION.replace(/-/g, '').toLowerCase()}`,
    };
    if (timestamp && Number.isInteger(timestamp) && timestamp < Date.now()) cenote.timestamp = timestamp;
    return producer.send('cenoteIncoming', JSON.stringify({ data, cenote })).then(() => res.status(202).json({ message: 'Event sent.' }));
  }));

module.exports = router;
