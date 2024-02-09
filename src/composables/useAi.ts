import type { OpenaiJsonResponse } from "~/types";

export const useAiContent = (content: string): OpenaiJsonResponse => {
    const regex = /```json([^`]+|\n[`^`]+)*?```/g;
    const stripedString = content.replace(regex, (match, content) => {
        const processedContent = content.replace(/`/g, "\\`");
        return processedContent;
    });
    return JSON.parse(stripedString);
}