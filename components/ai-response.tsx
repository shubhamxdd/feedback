"use client";

import { useState } from "react";

import { generate } from "@/actions/ai-response";
import { readStreamableValue } from "ai/rsc";
import { Button } from "./ui/button";

const AiResponse = () => {
  const [generation, setGeneration] = useState("");

  return (
    <div>
      <Button
        className="mt-2"
        onClick={async () => {
          const { output } = await generate();

          for await (const delta of readStreamableValue(output)) {
            setGeneration(
              (currentGeneration) => `${currentGeneration}${delta}`
            );
          }
        }}
      >
        Ask gemini
      </Button>
      {generation && (
        <div>
          {generation.split("||").map((item, index) => (
            <p key={index}>{item}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default AiResponse;
