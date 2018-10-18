const express = require('express');
const request = require('supertest');
const routes = require('../routes');

describe('The Server', () => {
	const app = express();
	app.use('/', routes);

	test('serves as an example endpoint', () => request(app).get('/works')
		.expect(200).expect(response => expect(response.text).toContain('It does!')));

	test('returns HTML on an unknown endpoint', () => request(app).get('/*')
		.expect(response => expect(response.header['content-type']).toBe('text/plain; charset=utf-8')));
});
