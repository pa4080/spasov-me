"use client";
import MDEditor, { commands, type RefMDEditor } from "@uiw/react-md-editor";
import { Sparkles } from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  type ControllerRenderProps,
  type FieldValues,
  type Path,
  type PathValue,
  type UseFormReturn,
} from "react-hook-form";

import { type DeepSeekRequest } from "@/app/api/deepseek/route";

interface Props<T extends FieldValues> {
  className?: string;
  placeholder: string;
  form: UseFormReturn<T>;
  field: ControllerRenderProps<T, Path<T>>;
}

function FormMdEditor<T extends FieldValues>({ className, placeholder, form, field }: Props<T>) {
  const [aiLoading, setAiLoading] = useState(false);
  const editorRef = useRef<RefMDEditor>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null | undefined>(null);
  const selectionRef = useRef({ start: 0, end: 0 });
  const completionRef = useRef("");
  const stopControllerRef = useRef<AbortController | null>(null);

  // Optimized textarea reference setup
  useEffect(() => {
    const setTextareaRef = () => {
      if (editorRef.current && !textareaRef.current) {
        textareaRef.current = editorRef.current.textarea;
      }
    };

    // Set immediately if possible
    setTextareaRef();

    // Set a timeout as fallback for when editor is not ready
    const timeoutId = setTimeout(setTextareaRef, 100);

    return () => clearTimeout(timeoutId);
  }, []); // Empty dependency array ensures this runs only once

  const handleAIComplete = useCallback(
    async ({ temperature, max_tokens, model }: Partial<Omit<DeepSeekRequest, "prompt">> = {}) => {
      if (!textareaRef.current) {
        console.error("Textarea reference not available");

        return;
      }

      setAiLoading(true);
      const textarea = textareaRef.current;

      // Save current selection
      selectionRef.current = {
        start: textarea.selectionStart,
        end: textarea.selectionEnd,
      };

      // Save current value in case of cancellation
      const originalValue = textarea.value;

      completionRef.current = "";

      const prompt =
        textarea.value.substring(textarea.selectionStart, textarea.selectionEnd) ||
        textarea.value.substring(0, textarea.selectionStart) ||
        textarea.value;

      // Create AbortController and keep it in a ref
      stopControllerRef.current = new AbortController();

      try {
        const resp = await fetch("/api/deepseek", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, temperature, max_tokens, model }),
          signal: stopControllerRef.current.signal, // 🔑 connect abort
        });

        if (!resp.body) {
          throw new Error("No response body");
        }

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((line) => line.trim());

          for (const line of lines) {
            if (!line.startsWith("data: ")) {
              continue;
            }

            if (line.includes("[DONE]")) {
              await reader.cancel();
              break;
            }

            try {
              const data = JSON.parse(line.replace("data: ", "")) as {
                choices: { delta: { content: string } }[];
              };
              const token = data.choices[0]?.delta?.content || "";

              completionRef.current += token;

              // Update editor incrementally
              const newValue =
                originalValue.substring(0, selectionRef.current.start) +
                completionRef.current +
                originalValue.substring(selectionRef.current.end);

              form.setValue("description" as Path<T>, newValue as PathValue<T, Path<T>>, {
                shouldValidate: true,
              });

              // Update cursor position
              const newCursorPos = selectionRef.current.start + completionRef.current.length;

              setTimeout(() => {
                if (textareaRef.current) {
                  textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
                  textareaRef.current.focus();
                }
              }, 0);
            } catch {
              // Ignore bad JSON lines
            }
          }
        }
      } catch (error: unknown) {
        if ((error as Error).name === "AbortError") {
          // eslint-disable-next-line no-console
          console.log("Stream aborted by user");
        } else {
          console.error("AI Completion Error:", error);
          // Revert on error
          form.setValue("description" as Path<T>, originalValue as PathValue<T, Path<T>>, {
            shouldValidate: true,
          });
        }
      } finally {
        setAiLoading(false);
      }
    },
    [form]
  );

  const aiCompleteCommand: commands.ICommand = {
    name: "aiComplete",
    keyCommand: "aiComplete",
    icon: (
      <button
        disabled={aiLoading}
        title="AI Complete (Ctrl + .)"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          void handleAIComplete();
        }}
      >
        {aiLoading ? <span className="animate-spin">⏳</span> : <Sparkles size={14} />}
      </button>
    ),
    // execute: () => void handleAIComplete(), // Proper async handling
  };

  const stopCommand: commands.ICommand = {
    name: "stop",
    keyCommand: "stop",
    icon: (
      <button
        title="Stop generation"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          stopControllerRef.current?.abort();
        }}
      >
        ⏹️
      </button>
    ),
    // execute: () => stopControllerRef.current?.abort(),
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === ".") {
        event.preventDefault();
        if (aiLoading) {
          stopControllerRef.current?.abort();
        } else {
          void handleAIComplete({ temperature: 0.1, max_tokens: 32 });
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [aiLoading, form, handleAIComplete]);

  return (
    <MDEditor
      ref={editorRef}
      autoFocus
      enableScroll
      className={className}
      commands={[...commands.getCommands(), aiCompleteCommand, aiLoading ? stopCommand : {}]}
      extraCommands={[commands.codeEdit, commands.codeLive, commands.codePreview]}
      height={form.formState.errors.description ? "calc(100% - 1.8em)" : "100%"}
      overflow={false}
      preview="edit"
      textareaProps={{
        spellCheck: true,
        placeholder: placeholder,
        style: {
          overscrollBehavior: "none",
          display: "block",
          color: "inherit",
        },
      }}
      value={field.value}
      onChange={field.onChange}
    />
  );
}

export default memo(FormMdEditor) as typeof FormMdEditor;
