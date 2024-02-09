import { z } from "zod";

export const TextAnalysisSchema = z.object({
    redaction: z.string().min(1),
    proposal: z.union([z.string().min(1), z.null()])
})

export type ITextAnalysis = z.infer<typeof TextAnalysisSchema>