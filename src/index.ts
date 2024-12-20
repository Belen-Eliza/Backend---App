require('dotenv').config();
import { PrismaClient } from '@prisma/client'
import express, { NextFunction, Request, Response } from 'express'
import addRoutes from './routes'
import "express-async-errors";


const prisma = new PrismaClient()
const app = express()

app.use(express.json())

 app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}); 

addRoutes(app, prisma)

function logErrors(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  next(err);
}

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  res.status(500).send({ errors: [{ message: "Something went wrong" }] });
};

app.use(logErrors)
app.use(errorHandler)

const server = app.listen(3000, () =>
  console.log("🚀 Server ready at: http://localhost:3000"))

