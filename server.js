const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/accounts', (req, res) => {
    db('accounts').select('*')
    .then(accounts => {
        res.status(200).json(accounts);
    })
    .catch(err => {
        res.status(500).json({
            message: 'Error retrieving accounts',
            err
        })
    })
});

server.get('/accounts/:id', (req, res) => {
    const {id} = req.params;
    db('accounts').select('*').where({id})
    .then(account => {
        if(account[0]){
            res.status(200).json(account)
        } else {
            res.status(404).json({
                message: 'Invalid ID'
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            message: 'Error fetching account from database',
            err
        })
    })
});

server.post('/accounts', (req, res) => {
    const accountInfo = req.body;

    if(!accountInfo.name || !accountInfo.budget){
        res.status(400).json({
            message: 'Please include a name and budget'
        })
    } else {
    db('accounts').insert(accountInfo)        
    .then(account => {
        res.status(201).json(account)
    })
    .catch(err => {
        res.status(500).json({
            message: 'Error adding account to database',
            err
        })
    })        
    }
});

server.put('/accounts/:id', (req, res) => {
    const {id} = req.params;
    const changes = req.body;

    db('accounts').where({id}).update(changes)
    .then(count => {
        if(count){
            res.status(200).json({updated: count})
        } else {
            res.status(404).json({
                message: 'Invalid ID'
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            message: 'Error editing database',
            err
        })
    })
});

server.delete('/accounts/:id', (req, res) => {
    const {id} = req.params;

    db('accounts').where({id}).del()
    .then(count => {
        if(count){
            res.status(200).json({
                deleted: count
            })
        } else {
            res.status(500).json({
                message: 'Invalid ID'
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            message: 'Error deleting from database',
            err
        })
    })
})

module.exports = server;