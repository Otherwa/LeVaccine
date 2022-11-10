const request = require('supertest');
const app = require('./app')

describe('GET /', function () {
    it('get homepage', async function () {
        const response = await request(app)
            .get('/')
        expect(response.status).toEqual(200);
    });
});
