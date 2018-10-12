import express from 'express';
import request from 'supertest';
import routes from '../routes';

describe('The Server', () => {
	const app = express();
	app.use('/', routes);

	test('serves as an example endpoint', () => request(app).get('/works')
		.expect(200).expect(response => expect(response.text).toContain('It does!')));

	test('returns HTML on an unknown endpoint', () => request(app).get('/*')
		.expect(response => expect(response.header['content-type']).toBe('text/html; charset=utf-8')));
});
