import { type PrismaClient, type Prisma } from "@prisma/client"
import { Router } from "express"
import { connect } from "http2";



const GastosRoute = (prisma: PrismaClient)=>{
    const router = Router();
    
    router.get('/historial/:user_id/:fecha_desde/:fecha_hasta', async (req, res) => { 
        const {user_id,fecha_desde,fecha_hasta} = req.params
        const gastos = await prisma.gasto.findMany({
          select: {
            monto: true, cant_cuotas: true,fecha: true, category: true
          },
          where: {
            user_id: Number(user_id),
              
            fecha: {
              lte: fecha_hasta,
              gte: fecha_desde,
            },
          },
          orderBy: {
            fecha: "desc" //más recientes primero
          },
        })
        if(gastos.length==0){
            res.status(400).send("Todavía no has cargado ningún gasto") 
            return
        }
        res.json(gastos)
        
    })

    router.get('/por_fecha/:user_id/:fecha_desde/:fecha_hasta', async (req,res)=>{
      const {fecha_desde,fecha_hasta,user_id} = req.params;
      const gastos = await prisma.gasto.findMany({
        select: {
          monto: true, cant_cuotas: true,fecha: true, category: true
        },
        where: {
          user_id: Number(user_id),
          
          fecha: {
            lte: fecha_hasta,
            gte: fecha_desde,
          },
        },
        orderBy: {
          fecha: "asc" 
        },
      })
      
      if(gastos.length==0){
          res.status(400)
          return
      }
      res.json(gastos)
    })


    router.get('/por_categoria/:user_id',async (req, res) => {
        const {user_id} = req.params;
        const gastos_por_cate = await prisma.gasto.groupBy({
            by: ["category_id"],
            
            where: { user_id:Number(user_id)},
            _sum: {monto:true},
            
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
          fecha: (new Date()).toISOString(), //fecha de hoy 
          user: {
            connect:{
              id: user_id
            }
          },
          category: {
            connect:{
              id: category_id
            }
          }
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