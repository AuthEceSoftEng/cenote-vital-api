const express = require('express');
const { Producer } = require('sinek');
const uuid = require('uuid/v4');

const { Organization, Project } = require('../models');

const router = express.Router({ mergeParams: true });

router.post('/:EVENT_COLLECTION', (req, res) => {
	Organization.findOne({ username: req.params.ORG_ID }, {}, { lean: true }, (err, org) => {
		if (err || !org) return res.status(404).json({ message: `Organization ${req.params.ORG_ID} doesn't exist!`, err });
		const orgKey = req.headers.authorization;
		if (!orgKey) return res.status(403).json({ error: 'No credentials sent!' });
		if (orgKey !== org.organizationId) return res.status(401).json({ message: 'Organization not authenticated!' });
		return Project.findOne({ organization: org._id }, {}, { lean: true }, (err2, project) => {
			if (err2 || !project) {
				return res.status(404).json({ message: `Can't find project with id ${req.params.PROJECT_ID} in ${req.params.ORG_ID}!`, err2 });
			}
			const { writeKey, masterKey } = req.body;
			if (!writeKey && !masterKey) return res.status(403).json({ error: 'No key credentials sent!' });
			if (!(writeKey === project.writeKey || masterKey === project.masterKey)) {
				return res.status(401).json({ message: 'Key hasn\'t authorization' });
			}
			const { data, timestamp } = req.body;
			if (!data) return res.status(400).json({ error: 'No data sent!' });
			const producer = new Producer(config, ['cenoteIncoming'], 15);
			producer.on('error', console.error);
			return producer.connect().then(() => {
				const cenote = {
					created_at: Date.now(),
					id: uuid(),
					url: `/projects/${req.params.PROJECT_ID}/events/${req.params.EVENT_COLLECTION}`,
				};
				if (timestamp && Number.isInteger(timestamp) && timestamp < Date.now()) cenote.timestamp = timestamp;
				producer.send('cenoteIncoming', JSON.stringify({ data, cenote })).then(() => res.status(202).json({ message: 'Event sent.' }));
			});
		});
	});
});


const config = {
	zkConStr: '83.212.104.172:2181,83.212.96.15:2181,83.212.104.177:2181',
	workerPerPartition: 3,
	options: {
		sessionTimeout: 8000,
		protocol: ['roundrobin'],
		fromOffset: 'earliest',
		fetchMaxBytes: 1024 * 100,
		fetchMinBytes: 1,
		fetchMaxWaitMs: 10,
		heartbeatInterval: 250,
		retryMinTimeout: 250,
		autoCommit: true,
		autoCommitIntervalMs: 1000,
		requireAcks: 0,
		ackTimeoutMs: 100,
		partitionerType: 3,
	},
};

module.exports = router;
