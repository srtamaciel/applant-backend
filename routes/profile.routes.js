const express = require('express')
const router = express.Router()

const User = require('../models/User.model')
const Plant = require('../models/Plant.model')
router.get('/profile', (req, res, next) => {
  res.send('profile send from backend!')
})

router.get('/loggedin', (req, res, next) => {
  res.send(req.user)
})

router.post('/add-plant', (req, res) => {
  const { name } = req.body
  Plant.findOne({ name })
    .then((result) => {
      if (result) {
        if (!req.user.plants.includes(result._id)) {
          User.findByIdAndUpdate(req.user._id, {
            $push: { plants: result._id },
          }).then((result) => {
            res.send({
              message: `${result.commonName} added successfully`,
              result,
            })
          })
        } else {
          res.send({ message: 'This plant has been already added' })
        }
      } else {
        Plant.create(req.body).then((result) => {
          User.findByIdAndUpdate(req.user._id, {
            $push: { plants: result._id },
          }).then((result) => {
            res.send({
              message: `${result.commonName} created and added successfully`,
              result,
            })
          })
        })
      }
    })
    .catch((error) => {
      console.log(error)
      res.send({ message: 'Error adding plant' })
    })
})

module.exports = router
