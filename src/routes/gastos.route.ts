import { type PrismaClient, type Prisma } from "@prisma/client"
import { Router, type Express } from "express"

const GastosRoute = (prisma: PrismaClient)=>{
    const router = Router();

    router.get('/gastos', async (req, res) => { //todos los gastos del usuario, para el historial
        const {user_id} = req.query
        const gastos = await prisma.gasto.findMany({
          select: {
            monto: true, cant_cuotas: true,fecha: true, category_id:true
          },
          where: {
            user_id: Number(user_id)
          },
          orderBy: {
            fecha: "desc" //más recientes primero
          },
          
        })
        if(!gastos){
            res.status(400).send("Todavía no has cargado ningún gasto") //error acá que se atrapa en el front-end?
            return
        }
        res.json(gastos)
    })
    router.post('/signup', async (req, res) => {
        const { name, mail, password } = req.body;
        const result = await prisma.user.create({
          data: {
            name,
            mail,
            password,
            saldo: 0  //que empiece en 0 y se vaya cargando o cargar valor inicial??
          },
        })
        res.json(result);
    })


    return router
}

export default GastosRoute;