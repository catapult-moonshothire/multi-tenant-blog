"use client";

import { useAuth } from "@/components/providers/auth-context";
import { cn } from "@/lib/utils";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { Typography } from "@tiptap/extension-typography";
import { Underline } from "@tiptap/extension-underline";
import type { Content, Editor, UseEditorOptions } from "@tiptap/react";
import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import * as React from "react";
import { toast } from "sonner";
import {
  CodeBlockLowlight,
  Color,
  FileHandler,
  HorizontalRule,
  Image,
  Link,
  ResetMarksOnEnter,
  Selection,
  UnsetAllMarks,
} from "../extensions";
import { useThrottle } from "../hooks/use-throttle";
import { getOutput } from "../utils";

export interface UseMinimalTiptapEditorProps extends UseEditorOptions {
  value?: Content;
  output?: "html" | "json" | "text";
  placeholder?: string;
  editorClassName?: string;
  throttleDelay?: number;
  onUpdate?: (content: Content) => void;
  onBlur?: (content: Content) => void;
}

// Define the return type to match what TipTap expects
type UploadResult = { id: string; src: string };

// Map to track files being processed to prevent duplicate uploads
const uploadCache = new Map<string, Promise<UploadResult>>();

// Helper to create a simple file fingerprint for deduplication
const getFileFingerprint = (file: File): string => {
  return `${file.name}-${file.size}-${file.lastModified}`;
};

// Centralized image upload function with deduplication
const uploadImage = async (
  file: File,
  subdomain: string
): Promise<UploadResult> => {
  // Create a fingerprint for this specific file
  const fileFingerprint = getFileFingerprint(file);

  // Check if this file is already being uploaded
  if (uploadCache.has(fileFingerprint)) {
    // We know this will be non-null because we just checked with has()
    return uploadCache.get(fileFingerprint)!;
  }

  // Start a new upload and cache the promise
  const uploadPromise = (async (): Promise<UploadResult> => {
    try {
      const filename = `${file.name}`;
      const response = await fetch(
        `/api/upload-image?filename=${encodeURIComponent(
          filename
        )}&subdomain=${subdomain}`,
        {
          method: "POST",
          body: file,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      return { id: data.url, src: data.url };
    } catch (error) {
      console.error("Error uploading image:", error);
      // Remove from cache if upload fails
      uploadCache.delete(fileFingerprint);
      throw error;
    }
  })();

  // Store in cache
  uploadCache.set(fileFingerprint, uploadPromise);

  // Return the promise
  return uploadPromise;
};

const createExtensions = (placeholder: string, subdomain: string) => [
  StarterKit.configure({
    horizontalRule: false,
    codeBlock: false,
    paragraph: { HTMLAttributes: { class: "text-node" } },
    heading: { HTMLAttributes: { class: "heading-node" } },
    blockquote: { HTMLAttributes: { class: "block-node" } },
    bulletList: { HTMLAttributes: { class: "list-node" } },
    orderedList: { HTMLAttributes: { class: "list-node" } },
    code: { HTMLAttributes: { class: "inline", spellcheck: "false" } },
    dropcursor: { width: 2, class: "ProseMirror-dropcursor border" },
  }),
  Link,
  Underline,
  Image.configure({
    allowedMimeTypes: ["image/*"],
    maxFileSize: 5 * 1024 * 1024,
    uploadFn: (file, editor) => uploadImage(file, subdomain),
    onImageRemoved({ id, src }) {
      console.log("Image removed", { id, src });
      // You can implement image deletion from Vercel Blob here if needed
    },
    onValidationError(errors) {
      errors.forEach((error) => {
        toast.error("Image validation error", {
          position: "bottom-right",
          description: error.reason,
        });
      });
    },
    onActionSuccess({ action }) {
      const mapping = {
        copyImage: "Copy Image",
        copyLink: "Copy Link",
        download: "Download",
      };
      toast.success(mapping[action], {
        position: "bottom-right",
        description: "Image action success",
      });
    },
    onActionError(error, { action }) {
      const mapping = {
        copyImage: "Copy Image",
        copyLink: "Copy Link",
        download: "Download",
      };
      toast.error(`Failed to ${mapping[action]}`, {
        position: "bottom-right",
        description: error.message,
      });
    },
  }),
  FileHandler.configure({
    allowedMimeTypes: ["image/*"],
    maxFileSize: 5 * 1024 * 1024,
    onDrop: async (editor, files, pos) => {
      for (const file of files) {
        try {
          const result = await uploadImage(file, subdomain);
          editor.commands.insertContentAt(pos, {
            type: "image",
            attrs: { src: result.src },
          });
        } catch (error) {
          if (error instanceof Error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image", {
              position: "bottom-right",
              description: error.message,
            });
          } else {
            console.error("Unknown error uploading image:", error);
            toast.error("An unknown error occurred while uploading the image", {
              position: "bottom-right",
            });
          }
        }
      }
    },
    onPaste: async (editor, files) => {
      for (const file of files) {
        try {
          const result = await uploadImage(file, subdomain);
          editor.commands.insertContent({
            type: "image",
            attrs: { src: result.src },
          });
        } catch (error) {
          if (error instanceof Error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image", {
              position: "bottom-right",
              description: error.message,
            });
          } else {
            console.error("Unknown error uploading image:", error);
            toast.error("An unknown error occurred while uploading the image", {
              position: "bottom-right",
            });
          }
        }
      }
    },
    onValidationError: (errors) => {
      errors.forEach((error) => {
        toast.error("Image validation error", {
          position: "bottom-right",
          description: error.reason,
        });
      });
    },
  }),
  Color,
  TextStyle,
  Selection,
  Typography,
  UnsetAllMarks,
  HorizontalRule,
  ResetMarksOnEnter,
  CodeBlockLowlight,
  Placeholder.configure({ placeholder: () => placeholder }),
];

export const useMinimalTiptapEditor = ({
  value,
  output = "html",
  placeholder = "",
  editorClassName,
  throttleDelay = 0,
  onUpdate,
  onBlur,
  ...props
}: UseMinimalTiptapEditorProps) => {
  const throttledSetValue = useThrottle(
    (value: Content) => onUpdate?.(value),
    throttleDelay
  ) as (value: unknown) => void;

  const handleUpdate = React.useCallback(
    (editor: Editor) => throttledSetValue(getOutput(editor, output)),
    [output, throttledSetValue]
  );
  const { user } = useAuth();
  const subdomain = user?.subdomain;

  const handleCreate = React.useCallback(
    (editor: Editor) => {
      if (value && editor.isEmpty) {
        editor.commands.setContent(value);
      }
    },
    [value]
  );

  const handleBlur = React.useCallback(
    (editor: Editor) => onBlur?.(getOutput(editor, output)),
    [output, onBlur]
  );

  const editor = useEditor({
    extensions: createExtensions(placeholder, subdomain || ""),
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        class: cn("focus:outline-none", editorClassName),
      },
    },
    onUpdate: ({ editor }) => handleUpdate(editor),
    onCreate: ({ editor }) => handleCreate(editor),
    onBlur: ({ editor }) => handleBlur(editor),
    ...props,
  });

  return editor;
};

export default useMinimalTiptapEditor;
