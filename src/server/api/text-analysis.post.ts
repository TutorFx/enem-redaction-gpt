import { HeadersOpenai } from "../utils/openai";
import type { OpenaiResponse } from "@/types";

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, (validate) =>
    TextAnalysisSchema.safeParse(validate)
  );

  if (!result.success) throw result.error.issues;

  const body = result.data;

  const rules = [
    "Domínio da modalidade escrita formal da língua portuguesa",
    "Seleção, organização e estruturação das informações e argumentos",
    "Articulação das diferentes partes do texto",
    "Elaboração de proposta de intervenção",
  ];

  if (body.proposal) {
    rules.push(`Compreensão da proposta (${body.proposal})`);
  }

  console.log(rules);

  const response = $fetch<OpenaiResponse>(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: HeadersOpenai(),
      body: {
        model: "gpt-4-1106-preview",
        messages: [
          {
            role: "system",
            content: `Responda em um formato JSON, seguindo a seguinte tipagem:
              """
              type Fields = "dominio_lingua" | "compreensao_proposta" | "estruturacao" | "articulacao" | "proposta_intervencao"
  
              interface OpenaiJsonResponse {
                recomendations: string,
                insights: {
                  field: Fields,
                  message: string,
                }[],
                reportcard: {
                  field: Fields,
                  grade: number
                }[]
              }
              """
            `,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Baseado no seguinte texto, faça uma análise breve do desempenho do autor, levando em conta
                    os seguintes fatores: ${rules.toLocaleString()}.
                    """
                    ${body.redaction}
                    """
                    `,
              },
            ],
          },
        ],
        max_tokens: 3000,
      },
    }
  );

  if (!response)
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: "Erro na IA",
      })
    );

  return response;
});
