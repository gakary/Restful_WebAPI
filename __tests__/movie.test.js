const request = require('supertest')
const app = require ('../test.index');





//Movie Testing
it('List all the movies', () => {
    request('https://127.0.0.1:8080')
      .get('/api/movies/')
      .send({})
      .expect(200)
  })

  it('Get the movie by name', () => {
    request('https://127.0.0.1:8080')
      .get('/api/movies/findByName/{name}')
      .send({})
      .expect(200)
  })
  
  it('Get the staff created movies by id', () => {
    request('https://127.0.0.1:8080')
      .get('/api/movies/staff/{_staff_id}')
      .send({_id:'632f60d19de4c9b18b64609b'})
      .expect(200)
  })

  it('Update the movie by the id', () => {
    request('https://127.0.0.1:8080')
      .patch('/api/movies/{_id}')
      .send({title:'HungryGame2'})
      .expect(200)
  })

  it('Post the movie', () => {
    request('https://127.0.0.1:8080')
      .post('/api/movies/')
      .send({
        title:'Avatar2',
        description:'Jake Sully lives with his newfound family formed on the planet of Pandora. ',
        price:'300',
        staff:'632f60d19de4c9b18b64609b',
    })
      .expect(200)
  })



  it('Remove the movie by title', () => {
    request('https://127.0.0.1:8080')
      .delete('/api/movies/{name}')
      .send({title:'Avatar2'})
      .expect(200)
  })
  