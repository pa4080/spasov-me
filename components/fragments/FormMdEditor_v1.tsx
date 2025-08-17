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

import { getAICompletion_v1 } from "@/lib/actions/deepseek_v1";

interface Props<T extends FieldValues> {
  className?: string;
  placeholder: string;
  form: UseFormReturn<T>;
  field: ControllerRenderProps<T, Path<T>>;
}

function FormMdEditor<T extends FieldValues>({ className, placeholder, form, field }: Props<T>) {
  // AI Complete -- BEGIN
  const [aiLoading, setAiLoading] = useState(false);
  const editorRef = useRef<RefMDEditor>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null | undefined>(null);

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

  const handleAIComplete = useCallback(async () => {
    if (!textareaRef.current) {
      console.error("Textarea reference not available");

      return;
    }

    setAiLoading(true);

    try {
      const textarea = textareaRef.current;
      const prompt =
        textarea.value.substring(textarea.selectionStart, textarea.selectionEnd) || textarea.value;

      const completion = await getAICompletion_v1(prompt);

      const newValue =
        textarea.value.substring(0, textarea.selectionStart) +
        completion +
        textarea.value.substring(textarea.selectionEnd);

      form.setValue("description" as Path<T>, newValue as PathValue<T, Path<T>>, {
        shouldValidate: true,
      });

      // Update cursor position
      const newCursorPos = textarea.selectionStart + completion.length;

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
          textareaRef.current.focus();
        }
      }, 0);
    } catch (error) {
      console.error("AI Completion Error:", error);
    } finally {
      setAiLoading(false);
    }
  }, [form]);

  const aiCompleteCommand: commands.ICommand = {
    name: "aiComplete",
    keyCommand: "aiComplete",
    icon: (
      <button
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
  // AI Complete - END

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === ".") {
        event.preventDefault();
        void handleAIComplete();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [form, handleAIComplete]);

  return (
    <MDEditor
      ref={editorRef}
      autoFocus
      enableScroll
      className={className}
      commands={[...commands.getCommands(), aiCompleteCommand]}
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
