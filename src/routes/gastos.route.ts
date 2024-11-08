import { type PrismaClient, type Prisma } from "@prisma/client"
import { Router } from "express"

const GastosRoute = (prisma: PrismaClient)=>{
    const router = Router();

    router.get('/:user_id', async (req, res) => { //todos los gastos del usuario, para el historial
        const {user_id} = req.params
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


    router.get('/por_categoria/:user_id',async (req, res) => {
        const {user_id} = req.params;
        const gastos_por_cate = await prisma.gasto.groupBy({
            by: "category_id",
            where: { user_id:Number(user_id)},
            _sum: {monto:true}
            
        })
        res.json(gastos_por_cate)
    })

    router.post('/', async (req, res) => {
      const { monto, cant_cuotas,user_id,category_id } = req.body; 
      
      const user =await prisma.user.findUnique({
        where: {id:user_id}
      })
      if (!user ){
        res.status(400).send({message: "Error al cargar los datos"})
        return
      }
      const result = await prisma.gasto.create({
        data: {
          monto, 
          cant_cuotas,
          fecha: Date.now().toString(), //fecha de hoy 
          user_id,
          category_id
        },
      })
      await prisma.user.update({
        data: {saldo: user.saldo-monto},
        where: {id:user_id}
      })
      res.json(result);
    })

    return router
}

export default GastosRoute;