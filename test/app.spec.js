const app = require('../src/app')
const knex = require('knex')
const { expect } = require('chai')
const supertest = require('supertest')
const { makeUsersArray } = require('./user.fixtures')
const fixtures = require('./user.fixtures')
const { makeEntriesArray } = require('./entry.fixtures')

describe('App', () => {
  it('GET / responds with 200 containing "Hello, world!"', () => {
    return supertest(app)
      .get('/')
      .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
      .expect(200, 'Hello, world!')
  })
})

describe('Users Endpoints', function () {
  let db

  before('make knex instance', () => {

    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE mindfull_users RESTART IDENTITY CASCADE'))

  afterEach('cleanup', () => db.raw('TRUNCATE mindfull_users RESTART IDENTITY CASCADE'))

  describe(`GET /api/users`, () => {
    context(`Given no users`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/users')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, [])
      })
    })

    context('Given there are users in the database', () => {
      const testUsers = fixtures.makeUsersArray()
      beforeEach('insert users', () => {
        return db
          .into('mindfull_users')
          .insert(testUsers)
      })

      it('responds with 200 and all of the users', () => {
        return supertest(app)
          .get('/api/users')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, testUsers)
      })
    })
  })

  describe(`GET /api/users/:id`, () => {
    context(`Given no users`, () => {
      it(`responds with 404`, () => {
        const userId = 123456
        return supertest(app)
          .get(`/api/users/${userId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(404, { error: { message: `User doesn't exist` } })
      })
    })

    context('Given there are users in the database', () => {
      const testUsers = makeUsersArray();

      beforeEach('insert users', () => {
        return db
          .into('mindfull_users')
          .insert(testUsers)
      })

      it('responds with 200 and the specified user', () => {
        const userId = 2
        const expectedUser = testUsers[userId - 1]
        return supertest(app)
          .get(`/api/users/${userId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedUser)
      })
    })
  })

  describe(`POST /api/users`, () => {
    it(`creates a user, responding with 201 and the new user`, () => {
      const newUser = {
        username: 'Newbie',
        pw: '654321',
      }
      return supertest(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .send(newUser)
        .expect(201)
        .expect(res => {
          expect(res.body.username).to.eql(newUser.username)
          expect(res.body.pw).to.eql(newUser.pw)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
        })
        .then(res =>
          supertest(app)
            .get(`/api/users/${res.body.id}`)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(res.body)
        )
    })

    const requiredFields = ['username', 'pw']

    requiredFields.forEach(field => {
      const newUser = {
        username: 'testname',
        pw: 'testpw'
      }
      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newUser[field]

        return supertest(app)
          .post('/api/users')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .send(newUser)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      })
    })
  })

  describe(`DELETE /api/users/:id`, () => {
    context(`Given no users`, () => {
      it(`responds with 404`, () => {
        const userId = 123456
        return supertest(app)
          .delete(`/api/users/${userId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(404, { error: { message: `User doesn't exist` } })
      })
    })

    context('Given there are users in the database', () => {
      const testUsers = makeUsersArray()

      beforeEach('insert users', () => {
        return db
          .into('mindfull_users')
          .insert(testUsers)
      })

      it('responds with 204 and removes the entry', () => {
        const idToRemove = 2
        const expectedUsers = testUsers.filter(user => user.id !== idToRemove)
        return supertest(app)
          .delete(`/api/users/${idToRemove}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/users`)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(expectedUsers)
          )
      })
    })
  })

  describe(`PATCH /api/users/:id`, () => {
    context(`Given no users`, () => {
      it(`responds with 404`, () => {
        const userId = 123456
        return supertest(app)
          .patch(`/api/users/${userId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(404, { error: { message: `User doesn't exist` } })
      })
    })
    context('Given there are users in the database', () => {
      const testUsers = makeUsersArray()

      beforeEach('insert users', () => {
        return db
          .into('mindfull_users')
          .insert(testUsers)
      })

      it('responds with 204 and updates the user', () => {
        const idToUpdate = 2
        const updateUser = {
          username: 'updated-username',
          pw: 'updated-pw',
        }
        const expectedUser = {
          ...testUsers[idToUpdate - 1],
          ...updateUser
        }
        return supertest(app)
          .patch(`/api/users/${idToUpdate}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .send(updateUser)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/users/${idToUpdate}`)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(expectedUser)
          )
      })
      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/users/${idToUpdate}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain at least one updated field`
            }
          })
      })
      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2
        const updateUser = {
          username: 'updatedusername',
        }
        const expectedUser = {
          ...testUsers[idToUpdate - 1],
          ...updateUser
        }

        return supertest(app)
          .patch(`/api/users/${idToUpdate}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .send({
            ...updateUser,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/users/${idToUpdate}`)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(expectedUser)
          )
      })
    })
  })
})

describe('Entries Endpoints', function () {
  let db

  before('make knex instance', () => {

    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the entries table', () => db.raw('TRUNCATE mindfull_entries RESTART IDENTITY CASCADE'))

  before('clean the users table', () => db.raw('TRUNCATE mindfull_users RESTART IDENTITY CASCADE'))

  afterEach('cleanup entries table', () => db.raw('TRUNCATE mindfull_entries RESTART IDENTITY CASCADE'))

  afterEach('cleanup users table', () => db.raw('TRUNCATE mindfull_users RESTART IDENTITY CASCADE'))

  describe(`GET /api/entries`, () => {
    context(`Given no entries`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/entries')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, [])
      })
    })

    context('Given there are entries in the database', () => {
      const testUsers = fixtures.makeUsersArray()
      const testEntries = makeEntriesArray()

      beforeEach('insert users', () => {
        return db
          .into('mindfull_users')
          .insert(testUsers)
      })

      beforeEach('insert entries', () => {
        return db
          .into('mindfull_entries')
          .insert(testEntries)
      })

      it('responds with 200 and all of the entries', () => {
        return supertest(app)
          .get('/api/entries')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, testEntries)
      })
    })

    describe(`GET /api/entries/:id`, () => {
      context(`Given no entries`, () => {
        it(`responds with 404`, () => {
          const entryId = 123456
          return supertest(app)
            .get(`/api/entries/${entryId}`)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(404, { error: { message: `Entry doesn't exist` } })
        })
      })

      context('Given there are entries in the database', () => {
        const testUsers = fixtures.makeUsersArray()
        const testEntries = makeEntriesArray()

        beforeEach('insert users', () => {
          return db
            .into('mindfull_users')
            .insert(testUsers)
        })

        beforeEach('insert entries', () => {
          return db
            .into('mindfull_entries')
            .insert(testEntries)
        })

        it('responds with 200 and the specified entry', () => {
          const entryId = 2
          const expectedEntry = testEntries[entryId - 1]
          return supertest(app)
            .get(`/api/entries/${entryId}`)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(200, expectedEntry)
        })
      })
    })

    describe(`POST /api/entries`, () => {
      const testUsers = makeUsersArray()
      beforeEach('insert users', () => {
        return db
          .into('mindfull_users')
          .insert(testUsers)
      })

      it(`creates an entry, responding with 201 and the new entry`, () => {
        const newEntry = {
          date_created: '1/1/2021',
          month_created: "January",
          mood: "Happy",
          stress_level: 5,
          gratitude1: "A",
          gratitude2: "B",
          gratitude3: "C",
          notes: "test",
          userid: 1
        }
        return supertest(app)
          .post('/api/entries')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .send(newEntry)
          .expect(201)
          .expect(res => {
            expect(res.body.date_created).to.eql(newEntry.date_created)
            expect(res.body.month_created).to.eql(newEntry.month_created)
            expect(res.body.mood).to.eql(newEntry.mood)
            expect(res.body.stress_level).to.eql(newEntry.stress_level)
            expect(res.body.gratitude1).to.eql(newEntry.gratitude1)
            expect(res.body.gratitude2).to.eql(newEntry.gratitude2)
            expect(res.body.gratitude3).to.eql(newEntry.gratitude3)
            expect(res.body.notes).to.eql(newEntry.notes)
            expect(res.body.userid).to.eql(newEntry.userid)
            expect(res.body).to.have.property('id')
            expect(res.headers.location).to.eql(`/api/entries/${res.body.id}`)
          })
          .then(res =>
            supertest(app)
              .get(`/api/entries/${res.body.id}`)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(res.body)
          )
      })

      const requiredFields = ['date_created', 'month_created', 'mood', 'stress_level', 'gratitude1', 'gratitude2', 'gratitude3', 'notes', 'userid']

      requiredFields.forEach(field => {
        const newEntry = {
          date_created: '1/1/2021',
          month_created: "January",
          mood: "Happy",
          stress_level: 5,
          gratitude1: "A",
          gratitude2: "B",
          gratitude3: "C",
          notes: "test",
          userid: 1
        }
        it(`responds with 400 and an error message when the '${field}' is missing`, () => {
          delete newEntry[field]

          return supertest(app)
            .post('/api/entries')
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .send(newEntry)
            .expect(400, {
              error: { message: `Missing '${field}' in request body` }
            })
        })
      })
    })

    describe(`DELETE /api/entries/:id`, () => {
      context(`Given no entries`, () => {
        it(`responds with 404`, () => {
          const entryId = 123456
          return supertest(app)
            .delete(`/api/entries/${entryId}`)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(404, { error: { message: `Entry doesn't exist` } })
        })
      })

      context('Given there are entries in the database', () => {
        const testUsers = makeUsersArray()
        const testEntries = makeEntriesArray()

        beforeEach('insert users', () => {
          return db
            .into('mindfull_users')
            .insert(testUsers)
        })

        beforeEach('insert entries', () => {
          return db
            .into('mindfull_entries')
            .insert(testEntries)
        })

        it('responds with 204 and removes the entry', () => {
          const idToRemove = 2
          const expectedEntries = testEntries.filter(entry => entry.id !== idToRemove)
          return supertest(app)
            .delete(`/api/entries/${idToRemove}`)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(204)
            .then(res =>
              supertest(app)
                .get(`/api/entries`)
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(expectedEntries)
            )
        })
      })
    })

    describe(`PATCH /api/entries/:id`, () => {
      context(`Given no entries`, () => {
        it(`responds with 404`, () => {
          const entryId = 123456
          return supertest(app)
            .patch(`/api/entries/${entryId}`)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(404, { error: { message: `Entry doesn't exist` } })
        })
      })
      context('Given there are entries in the database', () => {
        const testUsers = makeUsersArray()
        const testEntries = makeEntriesArray()

        beforeEach('insert users', () => {
          return db
            .into('mindfull_users')
            .insert(testUsers)
        })

        beforeEach('insert entries', () => {
          return db
            .into('mindfull_entries')
            .insert(testEntries)
        })

        it('responds with 204 and updates the entry', () => {
          const idToUpdate = 2
          const updateEntry = {
            date_created: '1/1/2021',
            month_created: "January",
            mood: "Sad",
            stress_level: 6,
            gratitude1: "A",
            gratitude2: "B",
            gratitude3: "C",
            notes: "test-updated",
            userid: 2
          }
          const expectedEntry = {
            ...testEntries[idToUpdate - 1],
            ...updateEntry
          }
          return supertest(app)
            .patch(`/api/entries/${idToUpdate}`)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .send(updateEntry)
            .expect(204)
            .then(res =>
              supertest(app)
                .get(`/api/entries/${idToUpdate}`)
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(expectedEntry)
            )
        })
        it(`responds with 400 when no required fields supplied`, () => {
          const idToUpdate = 2
          return supertest(app)
            .patch(`/api/entries/${idToUpdate}`)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .send({ irrelevantField: 'foo' })
            .expect(400, {
              error: {
                message: `Request body must contain at least one updated field`
              }
            })
        })
        it(`responds with 204 when updating only a subset of fields`, () => {
          const idToUpdate = 2
          const updateEntry = {
            notes: "testing-update",
          }
          const expectedEntry = {
            ...testEntries[idToUpdate - 1],
            ...updateEntry
          }

          return supertest(app)
            .patch(`/api/entries/${idToUpdate}`)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .send({
              ...updateEntry,
              fieldToIgnore: 'should not be in GET response'
            })
            .expect(204)
            .then(res =>
              supertest(app)
                .get(`/api/entries/${idToUpdate}`)
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(expectedEntry)
            )
        })
      })
    })
  })
})