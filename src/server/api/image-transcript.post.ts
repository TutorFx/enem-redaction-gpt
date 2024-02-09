import fs from 'node:fs';
import path from 'node:path';
import formidable from "formidable";
import { HeadersOpenai } from '../utils/openai';
import type { OpenaiResponse } from '@/types';

export default defineEventHandler(async (event) => {
    const form = formidable({});

    const { filerepository } = await new Promise<{ filerepository: formidable.Files }>(
        (resolve, reject) => {
            form.parse(event.node.req, (err, fields, filerepository) => {
                if (err) {
                reject(err);
                }
                resolve({ filerepository });
            });
        }
    );

    if (filerepository.file === undefined) 
        return sendError(
            event,
                createError({
                    statusCode: 422,
                    statusMessage: "Arquivo é obrigatório",
                })
            );
            
    if (filerepository.file.length <= 0)
        return sendError(
        event,
            createError({
                statusCode: 422,
                statusMessage: "Arquivo é obrigatório",
            })
        );


    const file = filerepository.file.at(0);

    if (!file)
        return sendError(
        event,
            createError({
                statusCode: 422,
                statusMessage: "Arquivo não é válido",
            })
        );
    

    const filePath = path.resolve(file.filepath);
    const fileContent = fs.readFileSync(filePath);
    const base64Content = fileContent.toString('base64');

    const response = $fetch<OpenaiResponse>("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: HeadersOpenai(),
        body: {
            "model": "gpt-4-vision-preview",
            "messages": [
              {
                "role": "user",
                "content": [
                  {
                    "type": "text",
                    "text": `Na imagem é esperado que tenha um documento de texto cursivo. Caso a 
                    imagem não contenha texto, responda 'null'. 
                    Caso contenha texto, escreva o exato conteúdo do
                    texto que está na imagem. não insira nenhum tipo de comentário ou faça 
                    mudança em sua resposta. Nos trechos impossíveis de serem 
                    lidos, insira "[...]". Caso exista um título
                    disponível, leve ele em consideração para contexto.`
                  },
                  {
                    "type": "image_url",
                    "image_url": {
                      "url": `data:image/jpeg;base64,${base64Content}`
                    }
                  }
                ]
              }
            ],
            "max_tokens": 3000
          }
    })

    if (!response) return sendError(
        event,
            createError({
                statusCode: 500,
                statusMessage: "Erro na IA",
            })
        );

    return response
      
});
