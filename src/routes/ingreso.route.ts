import { type PrismaClient, type Prisma } from "@prisma/client"
import { Router } from "express"
import { connect } from "http2";

const IngresoRoute = (prisma: PrismaClient)=>{
    const router = Router();
    router.post('/', async (req, res) => {
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
                monto, description:descripcion, 
                user:{
                    connect:{
                        id:user_id
                    }
                },
                category:{
                    connect:{
                        id:category_id
                    }
                }
            }
        })

        //actualizar el saldo total  
        await prisma.user.update({
            data: {saldo: user.saldo+monto},
            where: {id:user_id}
        })
       
        res.json(result);
    })
    router.get('/:user_id',  async (req, res) =>{
        const {user_id}=req.params;
        const result = await prisma.ingreso.findMany({
            select: {id:true,monto:true,category:true,description:true},
            where: {user_id: parseInt(user_id)}
        })
        res.json(result);
    })
    router.get('/unico/:ingreso_id',  async (req, res) =>{
        const {ingreso_id}=req.params;
        const result = await prisma.ingreso.findUnique({
            select: {id:true,monto:true,category:true,description:true},
            where: {id: parseInt(ingreso_id)}
        })
        res.json(result);
    })

    
    return router
}

export default IngresoRoute;