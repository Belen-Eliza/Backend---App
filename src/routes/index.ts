import { type PrismaClient } from "@prisma/client"
import UserRoute from "./user.route"
import GastoRoute from "./gastos.route"
import Ahorro_PresupuestoRoute from "./ahorro_presupuesto.routes"
import CategoriaRoute from "./categorias.route"
import IngresoRoute from "./ingreso.route"
import GastosFijosRoute from "./gasto_fijo.route"
import PresupuestoRoute from "./presupuesto.routes"

import { type Express } from "express"

const addRoutes = (app: Express, prisma: PrismaClient) => {
    app.get('/', (req, res) => {
        res.send({
            message: "Hello world!"
        })
    })
    
    app.use('/users/', UserRoute(prisma))
    app.use('/gastos/', GastoRoute(prisma))
    app.use('/categorias/', CategoriaRoute(prisma))
    app.use('/ahorro_presupuesto/', Ahorro_PresupuestoRoute(prisma))
    app.use('/ingresos/', IngresoRoute(prisma))
    app.use('/gastos_fijos/', GastosFijosRoute(prisma))
    app.use('/presupuestos/', PresupuestoRoute(prisma))
}

export default addRoutes