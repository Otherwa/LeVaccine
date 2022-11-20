const request = require('supertest')
const app = require('./app')

describe('GET All Pages', function () {
  it('get page1', async function () {
    const response = await request(app).get('/')
    expect(response.status).toEqual(200)
  })

  it('get page2', async function () {
    const response = await request(app).get('/education')
    expect(response.status).toEqual(200)
  })

  it('get page3', async function () {
    const response = await request(app).get('/contact')
    expect(response.status).toEqual(200)
  })

  it('get page4', async function () {
    const response = await request(app).get('/about')
    expect(response.status).toEqual(200)
  })
})
