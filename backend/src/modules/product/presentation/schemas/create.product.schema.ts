import * as z from "zod";

const CreateProductRequestSchema = z.object({
    title: z.string().nonempty({message: "Title is required"}),
    stock: z.number({ message: "Stock must be a number" }),
    price: z.number({ message: "Price must be a number" }),
})

export default CreateProductRequestSchema;