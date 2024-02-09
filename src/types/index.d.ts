export interface OpenaiResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
    choices: {
      message: {
        role: string;
        content: string;
      };
      logprobs: null;
      finish_reason: string;
      index: number;
    }[];
  };

export type Fields = "dominio_lingua" | "compreensao_proposta" | "estruturacao" | "articulacao" | "proposta_intervencao"

export interface OpenaiJsonResponse {
  recomendations: string;
  insights: {
    field: Fields;
    message: string;
  }[];
  reportcard: {
    field: Fields;
    grade: number;
  }[];
}