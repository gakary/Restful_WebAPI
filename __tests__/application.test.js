const request = require('supertest')
const app = require ('../test.index');





//Applications Testing
it('Get all applications form', () => {
  request('https://127.0.0.1:8080')
    .get('/api/application/getall')
    .send({})
    .expect(200)
})


it('Get the application by member id', () => {
  request('https://127.0.0.1:8080')
    .get('/api/application/{_member_id}')
    .send({id:'632f5a41a84f66d7af4b5ac8'})
    .expect(200)
})


it('Find the application by email address', () => {
    request('https://127.0.0.1:8080')
      .get('/api/application/{email}')
      .send({email:'leo@gmail.com'})
      .expect(200)
  })

  it('Update the application by email address', () => {
    request('https://127.0.0.1:8080')
      .patch('/api/application/{email}')
      .send({status:'accepted'})
      .expect(200)
  })

  it('Add a new application', () => {
    request('https://127.0.0.1:8080')
      .post('/api/application/upload')
      .send({
        movie:"Athena",
        email:'leo@gmail.com',
    })
      .expect(200)
  })

  it('Remove the application by application id', () => {
    request('https://127.0.0.1:8080')
      .delete('/api/application/{id}')
      .send({_id:'63315e72ba904e0077f0faf6'})
      .expect(200)
  })