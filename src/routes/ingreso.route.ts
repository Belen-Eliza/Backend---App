import { type PrismaClient, type Prisma } from "@prisma/client"
import { Router } from "express"

const IngresoRoute = (prisma: PrismaClient)=>{
    const router = Router();
    router.post('/cargar_ingreso', async (req, res) => {
        const { monto, descripcion,user_id,category_id } = req.body;
        
        //chequear que los datos sean correctos
        const user =await prisma.user.findUnique({
            where: {id:user_id}
        })
        if (!user ){
            res.status(400).send({message: "Error al cargar los datos"})
            return
        }

        const result = await prisma.ingreso.create({
            data:{
                monto, description:descripcion, category_id, user_id
            }
        })

        //actualizar el saldo total  
        await prisma.user.update({
            data: {saldo: user.saldo+monto},
            where: {id:user_id}
        })
       
        res.json(result);
    })
    router.get('/ingresos',  async (req, res) =>{
        const {user_id}=req.body();
        const result = await prisma.ingreso.findMany({
            select: {monto:true,category_id:true,description:true},
            where: {user_id: user_id}
        })
        res.json(result);
    })

    
    return router
}

export default IngresoRoute;