import * as z from "zod";

const AddItemSchema = z.object({
    product_id: z.string().uuid(),
})

export default AddItemSchema;
