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
        variant={"secondary"}
        className="mt-6"
        onClick={async () => {
          const { output } = await generate();
          setGeneration("");

          for await (const delta of readStreamableValue(output)) {
            setGeneration(
              (currentGeneration) => `${currentGeneration}${delta}`
            );
          }
        }}
      >
        Generate Messages with Gemini
      </Button>
      {generation && (
        <div className="p-2 border border-zinc-300 my-2 mx-2 flex flex-col gap-3 rounded-md">
          {generation.split("||").map((item, index) => (
            <Button variant={"outline"} key={index}>
              {item}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AiResponse;
