import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.createManyAndReturn({
    data: [{
      name: 'Alice',
      mail: 'alice@prisma.io',
      password: 'wonder!4nd'
    },
    {
      name: 'Cheshire',
      mail: 'ch@mail.com',
      password: 'wh1tera88it?'
    }
    ]
  })
  console.log("Users: \n",users);
  const categoriasGastos = await prisma.categoryGasto.createManyAndReturn({
    data:[
        {
        name: "Entretenimiento",
        description: "Cine, teatro, shows..."
        },
        {
        name: "Comida",
        description: "Supermercado, salidas"
        },
        {
        name: "Tecnología",
        description: "Celular, computadora, tablet..."
        },
        {
        name: "Auto",
        description: "Nafta, limpieza, reparaciones..."
        },
        {
        name: "Otros",
        description: ""
        },
        ]
    })
    console.log("Categorias de gastos: \n",categoriasGastos);

    const categoriasIngresos= await prisma.categoryIngreso.createManyAndReturn({
        data: [
            {
                name: "Sueldo",
                description: "Mensual"
            },
            {
                name: "Préstamo",
                description: ""
            },
            {
                name: "Regalo",
                description: ""
            },
            {
                name: "Otros",
                description: ""
            },
            {
                name: "Venta",
                description: ""
            },
        ]
    });
    console.log("Categorias de ingresos: \n",categoriasIngresos);

    const gastos = await prisma.gasto.createManyAndReturn({
        data:[
            {
                monto: 100,
                cant_cuotas: 1,
                fecha: (new Date()).toISOString(),
                user_id: 1,
                category_id: 1
            },
            {
                monto: 500,
                cant_cuotas: 1,
                fecha: (new Date(2023,10,2)).toISOString(),
                user_id: 1,
                category_id: 2
            },
            {
                monto: 10900,
                cant_cuotas: 3,
                fecha: (new Date(2024,5,10)).toISOString(),
                user_id: 1,
                category_id: 5
            },
            {
                monto: 330,
                cant_cuotas: 1,
                fecha: (new Date(2024,8,13)).toISOString(),
                user_id: 1,
                category_id: 1
            },
            {
                monto: 5000,
                cant_cuotas: 5,
                fecha: (new Date(2024,12,7)).toISOString(),
                user_id: 1,
                category_id: 3
            },
            {
                monto: 100,
                cant_cuotas: 1,
                fecha: (new Date()).toISOString(),
                user_id: 2,
                category_id: 1
            },
        ]
    })
    console.log("Gastos: \n",gastos);

    const ingresos = await prisma.ingreso.createManyAndReturn({
        data:[
            {
                monto: 13000.9,
                description: "Aguinaldo",
                fecha: (new Date()).toISOString(),
                category_id: 1,
                user_id: 1
            },
            {
                monto: 3000.89,
                description: "Cumpleaños",
                fecha: (new Date(2024,0,13)).toISOString(),
                category_id: 3,
                user_id: 1
            },
            {
                monto: 40000,
                description: "Mueble",
                fecha: (new Date(2023,4,25)).toISOString(),
                category_id: 5,
                user_id: 1
            },
            {
                monto: 500,
                description: "Bolsillo del chaleco",
                fecha: (new Date(2024,7,2)).toISOString(),
                category_id: 4,
                user_id: 1
            },
            {
                monto: 5000000,
                description: "Lotería",
                fecha: (new Date(2024,7,2)).toISOString(),
                category_id: 4,
                user_id: 2
            },
        ]
    })
    console.log("Ingresos: \n",ingresos);

    const presupuestos = await prisma.presupuesto.createManyAndReturn({
        data:[
            {
                descripcion: "Concierto Coldplay",
                montoTotal: 4000000,
                cant_cuotas: 15,
                fecha_objetivo: (new Date(2024,7,2)).toISOString(),
                total_acumulado: 0,
                user_id: 1
            },
            {
                descripcion: "Lollapalooza",
                montoTotal: 4000000,
                cant_cuotas: 15,
                fecha_objetivo: (new Date(2025,3,21)).toISOString(),
                total_acumulado: 0,
                user_id: 1
            }
        ]
    });
    console.log("Presupuestos: \n",presupuestos);

    
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })