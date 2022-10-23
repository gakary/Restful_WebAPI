const request = require('supertest')
const app = require ('../test.index');




//Users Testing
it('Login', () => {
  request('https://127.0.0.1:8080')
    .post('/api/user/login')
    .send({ email: 'garyfung@fake.com', password: '123456' })
    .expect(200)
})

it('Registration', () => {
  request('https://127.0.0.1:8080')
    .post('/api/user/register')
    .send({     username:'test',
    email:'testing@gmail.com',
    password:'abc221',
    role:'member'})
    .expect(200)
})
