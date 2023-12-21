import express from 'express'
import cors from 'cors'
import { route as routeTransaction } from './routes/transaction.js'
const app = express()
const PORT = 3000
app.use(cors({
    origin:'*'
}))
app.use('/api/v1',routeTransaction)
app.listen(PORT,()=>console.log('Server is running...'))