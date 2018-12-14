const express = require('express');

const { Organization, Project } = require('../models');
const events = require('./events');

const router = express.Router();

router.get('/:ORG_ID/projects', (req, res) => {
	Organization.findOne({ username: req.params.ORG_ID }, {}, { lean: true }, (err, org) => {
		if (err || !org) return res.status(404).json({ message: `Organization ${req.params.ORG_ID} doesn't exist!`, err });
		const orgKey = req.headers.authorization;
		if (!orgKey) return res.status(403).json({ error: 'No credentials sent!' });
		if (orgKey !== org.organizationId) return res.status(401).json({ message: 'Organization not authenticated!' });
		return Project.find({ organization: org._id }, { _id: 0, __v: 0, organization: 0 }, { lean: true }, (err2, projects) => {
			if (err2 || projects.length === 0) return res.status(404).json({ message: `Can't find projects of ${req.params.ORG_ID}!`, err });
			return res.status(200).json({ projects });
		});
	});
});


router.post('/:ORG_ID/projects', (req, res) => {
	Organization.findOne({ username: req.params.ORG_ID }, {}, { lean: true }, (err, org) => {
		if (err || !org) return res.status(404).json({ message: `Organization ${req.params.ORG_ID} doesn't exist!`, err });
		const orgKey = req.headers.authorization;
		if (!orgKey) return res.status(403).json({ error: 'No credentials sent!' });
		if (orgKey !== org.organizationId) return res.status(401).json({ message: 'Organization not authenticated!' });
		if (!req.body.title) return res.status(400).json({ error: 'No title sent!' });
		return Project.count({ organization: org._id, title: req.body.title }, (err2, count) => {
			if (err2) return res.status(400).send({ message: 'Create project failed', err });
			if (count > 0) return res.status(409).send({ message: `Project ${req.body.title} already exists!`, err });
			const newProject = Project({ organization: org._id, title: req.body.title });
			return newProject.save((err3, savedProject) => {
				if (err3) return res.status(400).send({ message: 'Create project failed', err });
				return res.send({ message: 'Project created successfully', project: savedProject.hide() });
			});
		});
	});
});


router.get('/:ORG_ID/projects/:PROJECT_ID', (req, res) => {
	Organization.findOne({ username: req.params.ORG_ID }, {}, { lean: true }, (err, org) => {
		if (err || !org) return res.status(404).json({ message: `Organization ${req.params.ORG_ID} doesn't exist!`, err });
		const orgKey = req.headers.authorization;
		if (!orgKey) return res.status(403).json({ error: 'No credentials sent!' });
		if (orgKey !== org.organizationId) return res.status(401).json({ message: 'Organization not authenticated!' });
		return Project.findOne({ organization: org._id, projectId: req.params.PROJECT_ID },
			{ _id: 0, __v: 0, organization: 0 }, { lean: true }, (err2, project) => {
				if (err2 || !project) {
					return res.status(404).json({ message: `Can't find project with id ${req.params.PROJECT_ID} in ${req.params.ORG_ID}!`, err });
				}
				return res.status(200).json({ project });
			});
	});
});


router.put('/:ORG_ID/projects/:PROJECT_ID', (req, res) => {
	Organization.findOne({ username: req.params.ORG_ID }, {}, { lean: true }, (err, org) => {
		if (err || !org) return res.status(404).json({ message: `Organization ${req.params.ORG_ID} doesn't exist!`, err });
		const orgKey = req.headers.authorization;
		if (!orgKey) return res.status(403).json({ error: 'No credentials sent!' });
		if (orgKey !== org.organizationId) return res.status(401).json({ message: 'Organization not authenticated!' });
		return Project.findOneAndUpdate({ organization: org._id, projectId: req.params.PROJECT_ID }, { ...req.body, updatedAt: Date.now() },
			{ new: true, lean: true }, (err2, project) => {
				if (err2 || !project) {
					return res.status(404).json({ message: `Can't find project with id ${req.params.PROJECT_ID} in ${req.params.ORG_ID}!`, err });
				}
				return res.status(200).json({ message: 'Project successfully updated!', project });
			});
	});
});


router.delete('/:ORG_ID/projects/:PROJECT_ID', (req, res) => {
	Organization.findOne({ username: req.params.ORG_ID }, {}, { lean: true }, (err, org) => {
		if (err || !org) return res.status(404).json({ message: `Organization ${req.params.ORG_ID} doesn't exist!`, err });
		const orgKey = req.headers.authorization;
		if (!orgKey) return res.status(403).json({ error: 'No credentials sent!' });
		if (orgKey !== org.organizationId) return res.status(401).json({ message: 'Organization not authenticated!' });
		return Project.findOneAndDelete({ organization: org._id, projectId: req.params.PROJECT_ID }, { lean: true }, (err2, project) => {
			if (err2 || !project) {
				return res.status(404).json({ message: `Can't find project with id ${req.params.PROJECT_ID} in ${req.params.ORG_ID}!`, err });
			}
			return res.status(200).json({ message: 'Project successfully deleted!', project });
		});
	});
});

router.use('/:ORG_ID/projects/:PROJECT_ID/events', events);

module.exports = router;
