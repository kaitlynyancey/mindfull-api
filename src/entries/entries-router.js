const path = require('path')
const express = require('express')
const xss = require('xss')
const EntriesService = require('./entries-service')

const entriesRouter = express.Router()
const jsonParser = express.json()

const serializeEntry = entry => ({
    id: entry.id,
    date_created: entry.date_created,
    month_created: xss(entry.month_created),
    mood: xss(entry.mood),
    stress_level: entry.stress_level,
    gratitude1: xss(entry.gratitude1),
    gratitude2: xss(entry.gratitude2),
    gratitude3: xss(entry.gratitude3),
    notes: xss(entry.notes),
    userid: entry.userid,
})

entriesRouter
    .route('/')
    .get((req, res, next) => {
        EntriesService.getAllEntries(
            req.app.get('db')
        )
            .then(entries => {
                res.json(entries.map(serializeEntry))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { date_created, month_created, mood, stress_level, gratitude1, gratitude2, gratitude3, notes, userid } = req.body
        const newEntry = { date_created, month_created, mood, stress_level, gratitude1, gratitude2, gratitude3, notes, userid }

        for (const [key, value] of Object.entries(newEntry)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }

        EntriesService.insertEntry(
            req.app.get('db'),
            newEntry
        )
            .then(entry => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${entry.id}`))
                    .json(serializeEntry(entry))
            })
            .catch(next)
    })

entriesRouter
    .route('/:id')
    .all((req, res, next) => {
        EntriesService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(entry => {
                if (!entry) {
                    return res.status(404).json({
                        error: { message: `Entry doesn't exist` }
                    })
                }
                res.entry = entry 
                next() 
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeEntry(res.entry))
    })
    .delete((req, res, next) => {
        EntriesService.deleteEntry(
            req.app.get('db'),
            req.params.id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { date_created, month_created, mood, stress_level, gratitude1, gratitude2, gratitude3, notes, userid } = req.body
        const entryToUpdate = { date_created, month_created, mood, stress_level, gratitude1, gratitude2, gratitude3, notes, userid }

        const numberOfValues = Object.values(entryToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain at least one updated field`
                }
            })
        }

        EntriesService.updateEntry(
            req.app.get('db'),
            req.params.id,
            entryToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = entriesRouter