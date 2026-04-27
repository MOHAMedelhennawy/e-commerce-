import * as z from "zod";

const IdSchema = z.string({ message: "Id must be a string" }).uuid({ message: "Invalid UUID format" });

export default IdSchema;