const express = require('express')
const fs = require('fs')
const ini = require('ini')

let config

module.exports = function (conf) {
  config = conf
  let opts = {}
  try {
    opts = ini.parse(fs.readFileSync('./.screepsrc', { encoding: 'utf8' }))
    opts = opts.pureAutomation || {}
    for (const k in opts) {
      if (opts[k] === 'false') opts[k] = false
      if (opts[k] === 'true') opts[k] = true
    }
  } catch (e) { }
  if (config.pureAutomation) opts = Object.assign(opts, config.pureAutomation)
  config.backend.on('expressPreConfig', (app) => {
    const router = express.Router()

    app.use('/api', router)

    if (opts.genUniqueObjectName === false) {
      router.post('/game/gen-unique-object-name', locked)
    }
    if (opts.checkUniqueObjectName === false) {
      router.post('/game/check-unique-object-name', locked)
    }
    if (opts.createFlag === false) {
      router.post('/game/create-flag', locked)
    }
    if (opts.genUniqueFlagName === false) {
      router.post('/game/gen-unique-flag-name', locked)
    }
    if (opts.checkUniqueFlagName === false) {
      router.post('/game/check-unique-flag-name', locked)
    }
    if (opts.changeFlagColor === false) {
      router.post('/game/change-flag-color', locked)
    }
    if (opts.removeFlag === false) {
      router.post('/game/remove-flag', locked)
    }
    if (opts.addObjectIntent === false) {
      router.post('/game/add-object-intent', locked)
    }
    if (opts.createConstruction === false) {
      router.post('/game/create-construction', locked)
    }
    if (opts.setNotifyWhenAttacked === false) {
      router.post('/game/set-notify-when-attacked', locked)
    }
    if (opts.createInvader === false) {
      router.post('/game/create-invader', locked)
    }
    if (opts.removeInvader === false) {
      router.post('/game/remove-invader', locked)
    }
    if (opts.respawn === false) {
      router.post('/user/respawn', locked)
    }
    if (opts.placeSpawn === false) {
      router.post('/game/place-spawn', locked)
    }
    if (opts.upload === false) {
      router.post('/user/code', locked)
    }
    if (opts.memory === false) {
      router.post('/user/memory', locked)
      router.post('/user/memory-segment', locked)
    }
    if (opts.console === false) {
      router.post('/user/console', locked)
    }
    if (opts.setBranch === false) {
      router.post('/user/set-active-branch', locked)
    }
  })
  config.cli.on('cliSandbox', (sandbox) => {
    sandbox.pureAutomation = config.pureAutomation
  })
}

function locked (req, res, next) {
  if (!config.pureAutomation.enabled) return next()
  res.status(423)
  res.end()
}
