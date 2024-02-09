const config = useRuntimeConfig();

export const HeadersOpenai = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${config.openai.key}`,
});
