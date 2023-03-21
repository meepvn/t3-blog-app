import { z } from "zod";

export const postInputValidator = z.object({
  content: z.string().min(1, "Content cannot be empty !!"),
  title: z.string().min(1, "Title cannot be empty !!"),
  tags: z.array(z.string()).min(1, "You have to pick at least 1 tag"),
  summary: z.string().min(1, "Summary cannot be empty"),
});
