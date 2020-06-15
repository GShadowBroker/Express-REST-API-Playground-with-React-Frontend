const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('notes are returned as json', async () => {
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are three notes', async () => {
    const response = await api.get('/api/notes')
    expect(response.body).toHaveLength(3)
})

test('the first note is about HTTP methods', async () => {
    const response = await api.get('/api/notes')
    expect(response.body[0].content).toBe('HTML is Easy')
})

test('a note without content is not saved', async () => {
    let newNote = {
        important: true
    }
    await api
        .post('/api/notes')
        .send(newNote)
        .expect(400)

    const response = await api.get('/api/notes')
    expect(response.body).toHaveLength(3)
})

afterAll(() => {
    mongoose.connection.close()
})