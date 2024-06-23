"use server";

import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { createStreamableValue } from "ai/rsc";

export async function generate() {
  "use server";

  const prompt =
    "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction.";

  const stream = createStreamableValue("");

  (async () => {
    const { textStream } = await streamText({
      model: google("models/gemini-pro"),
      prompt,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return { output: stream.value };
}
