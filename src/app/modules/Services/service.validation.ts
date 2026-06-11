import { z } from "zod";

const createServiceValidationSchema = z.object({
    body: z.object({
        name: z.string().nonempty({message:'Name is required'}),
        description: z.string(),
        price:z.number().min(0,{message:"price must be 0 to start"}),
        duration:z.number(),
        vehicleType: z.enum(["Small Car","Medium Car","SUV","MPV","Van/Truck"],{message:"Invalid vehicle type"})
    })
})
const updateServiceValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        price:z.number().min(0,{message:"price must be 0 to start"}).optional(),
        duration:z.number().optional(),
        vehicleType: z.enum(["Small Car","Medium Car","SUV","MPV","Van/Truck"],{message:"Invalid vehicle type"}).optional()
    })
})




export const  ServiceValidation = {
    createServiceValidationSchema,
    updateServiceValidationSchema
}