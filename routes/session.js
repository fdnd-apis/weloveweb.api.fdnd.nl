const express = require('express')
const Session = require('../models/session.model')

module.exports = express
  .Router()

  // Add a new item
  .post('/', async (req, res, next) => {
    try {
      console.log('Got: ', req.body)
      res.json(await Session.post(new Session(req.body)))
    } catch (err) {
      console.error('Error while adding: ', err.message)
      next(err)
    }
  })

  // List ALL items
  .get('/', async (req, res, next) => {
    try {
      res.json(await Session.get(req.query.page))
    } catch (err) {
      console.error('Error while getting all: ', err.message)
      next(err)
    }
  })

  // Get a specific item
  .get('/:id', async (req, res, next) => {
    try {
      res.json(await Session.getById(req.params.id))
    } catch (err) {
      res.json({
        message: `Error while getting specific: ${err.message}`,
        request: req.body,
      })
    }
  })

  // Put an item
  .put('/', async (req, res, next) => {
    try {
      res.json(await Session.put(new Session(req.body)))
    } catch (err) {
      res.json({
        message: `Error while putting: ${err.message}`,
        request: req.body,
      })
    }
  })

  // Patch an item
  .patch('/', async (req, res, next) => {
    try {
      res.json(await Session.patch(req.body))
    } catch (err) {
      res.json({
        message: `Error while patching: ${err.message}`,
        request: req.body,
      })
    }
  })

  // Delete an item
  .delete(['/', '/:id'], async (req, res, next) => {
    try {
      res.json(await Session.delete(req.params.id || req.body.id))
    } catch (err) {
      res.json({
        message: `Error while deleting: ${err.message}`,
        request: `You tried to delete id: ${req.params.id || req.body.id}`,
      })
    }
  })

// TODO
// .get('/v1/:searchString', async (req, res, next) => {})
// .get('/v1/quotes/length/asc', async (req, res, next) => {})
// .get('/v1/quotes/length/desc', async (req, res, next) => {})
// .get('/v1/quotes/alphabetical/asc', async (req, res, next) => {})
// .get('/v1/quotes/alphabetical/desc', async (req, res, next) => {})
