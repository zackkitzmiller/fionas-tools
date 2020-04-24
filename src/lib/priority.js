// const Enum = require('enum')
import Enum from 'enum'
Enum.register()

let PriorityEnum = new Enum({
  'LOW': 0,
  'MEDIUM': 1,
  'HIGH': 2
})

module.exports = PriorityEnum
