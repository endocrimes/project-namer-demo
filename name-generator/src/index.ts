import { ResponseBuilder, Llm } from "@fermyon/spin-sdk";

export async function handler(req: Request, res: ResponseBuilder) {
    if (req.method != "POST") {
      res.status(405);
      res.send(JSON.stringify({}));
      return;
    }

    let body = await req.json();

    let theme = body["theme"] || "space";
    console.log(`Requesting for the theme: ${theme}`);
    let answer = Llm.infer(Llm.InferencingModels.Llama2Chat, `
[INST] <<SYS>>
You are acting as a name generator, generating short, unique, pun-filled, appropriate, names based on a provided theme. Provide only a suggestion for a name. Never modify the users prompt. Always restrict your names to 4 words or less. Only provide a single suggestion. NEVER continue a prompt by generating a user question. Respond in the form of "Suggestion: {{name}}".
<</SYS>>

Please suggest a name based on ${theme}. [/INST]`, { temperature: 1.4, topP: 1 }).text;
    res.send(JSON.stringify({
      "response": answer.substring(answer.indexOf("Suggestion: ") + "Suggestion: ".length).trim().toLowerCase().replace(" ", "-")
    }));
}
