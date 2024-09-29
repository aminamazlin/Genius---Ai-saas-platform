import * as z from "zod";

export const formSchema = z.object({
  prompt: z.string().min(1, {     //The object should have a property/key 'prompt' and some validation rules.
    message: "Prompt is required"
  })
});

//z.string(): specififies that the value of the property must be a string.
//min(): to specify the minimum length.
//If the validation fails, a message will be shown.