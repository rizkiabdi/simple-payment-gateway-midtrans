import express from 'express'
import { parserJson } from '../middleware/parser.js'
import { transaction } from '../controllers/transaction.js'
export const route = express.Router()

route.post('/transaction',parserJson,transaction)