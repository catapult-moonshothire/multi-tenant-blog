"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FullScreenEditorProps } from "@/lib/types";
import { Loader, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { MinimalTiptapEditor } from "./minimal-tiptap";

export default function FullScreenEditor({
  currentPost,
  content,
  setContent,
  onSubmit,
  onCancel,
  onSaveDraft,
  register,
  errors,
  reset,
  watch,
  setValue,
  control,
  isSubmitting,
  isValid,
  subdomain,
}: FullScreenEditorProps) {
  const [suggestedMetaTitle, setSuggestedMetaTitle] = useState("");
  const [suggestedMetaDescription, setSuggestedMetaDescription] = useState("");

  // Clear form values when opening editor for a new post
  useEffect(() => {
    if (!currentPost) {
      // Default values to reset the form to
      const defaultValues = {
        title: "",
        slug: "",
        label: "",
        author: "",
        description: "",
        category: "",
        meta_title: "",
        meta_description: "",
      };

      reset();
      setContent(""); // Clear the editor content when creating a new post
    }
  }, [currentPost, reset, setContent]);

  // Helper function to strip HTML tags and get plain text

  const stripHtml = (html: string) => {
    if (!html) return "";
    // Create a temporary DOM element
    const temp = document.createElement("div");
    temp.innerHTML = html;
    // Return the text content only (no HTML)
    return temp.textContent || temp.innerText || "";
  };

  useEffect(() => {
    const title = watch("title");
    const contentText = stripHtml(content?.toString() || "");

    // Generate suggested meta title
    if (title) {
      const suggestedTitle = `${title} | ${subdomain}`; // Customize this as needed
      setSuggestedMetaTitle(suggestedTitle);
      // Auto-populate meta title if empty

      setValue("meta_title", suggestedTitle);
    }

    // Generate suggested meta description
    if (contentText) {
      const suggestedDescription = contentText.slice(0, 150).trim(); // Take the first 150 characters
      setSuggestedMetaDescription(suggestedDescription);
      // Auto-populate meta description if empty

      setValue("meta_description", suggestedDescription);
    }
  }, [watch("title"), content, setValue, watch, subdomain]);

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between border-b p-4">
          <h2 className="text-2xl font-bold">
            {currentPost ? "Edit Post" : "New Post"}
          </h2>
          <div className="flex items-center gap-2">
            {(!currentPost || currentPost.is_draft) && (
              <Button
                variant="outline"
                onClick={onSaveDraft}
                disabled={isSubmitting}
              >
                Save as Draft
              </Button>
            )}
            <Button
              type="submit"
              onClick={onSubmit}
              disabled={isSubmitting || !isValid || !content}
            >
              {isSubmitting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  {currentPost ? "Updating..." : "Submitting..."}
                </>
              ) : currentPost ? (
                currentPost.is_draft ? (
                  "Publish"
                ) : (
                  "Update Post"
                )
              ) : (
                "Publish"
              )}
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={onCancel}
              disabled={isSubmitting}
              className="bg-red-100 hover:bg-red-200"
            >
              <X className="h-5 w-5  text-red-600 font-bold" />
            </Button>
          </div>
        </header>
        <form className="flex flex-1 max-sm:flex-col overflow-hidden">
          <div className="flex-1 max-sm:w-full sm:overflow-auto p-4">
            <div className="mb-4">
              <Controller
                name="title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <Input
                    placeholder="Post Title"
                    className="text-xl md:text-3xl font-semibold md:h-16 border-0 px-0 focus-visible:ring-0"
                    disabled={isSubmitting}
                    {...field}
                  />
                )}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>
            <MinimalTiptapEditor
              value={content}
              onChange={setContent}
              className="sm:min-h-[500px]"
              editorContentClassName="prose max-w-none"
              output="html"
              placeholder="Start writing your post..."
              autofocus={true}
              editable={!isSubmitting}
            />
          </div>
          <div className="sm:w-80 lg:w-96 border-l overflow-y-auto">
            <div className="p-4 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Post Settings</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Controller
                      name="slug"
                      control={control}
                      rules={{
                        required: "Slug is required",
                        pattern: {
                          value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                          message:
                            "Slug must be lowercase, numbers, and hyphens only",
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          id="slug"
                          placeholder="post-url-slug"
                          {...field}
                        />
                      )}
                    />
                    {currentPost && (
                      <div className="mt-2 text-sm">
                        <Link
                          href={`${subdomain}/blog/${currentPost.slug}`}
                          target="_blank"
                          className="text-blue-500"
                          prefetch
                        >
                          View Post
                        </Link>
                      </div>
                    )}
                    {errors.slug && (
                      <p className="mt-1 text-sm text-destructive">
                        {errors.slug.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-4 sm:flex sm:space-x-4">
                    <div className="mb-4 sm:w-32">
                      <Label htmlFor="slug">Label</Label>
                      <Input
                        placeholder="Label (e.g., New)"
                        disabled={isSubmitting}
                        {...register("label")}
                      />
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="slug">Author</Label>
                      <Input
                        placeholder="Author"
                        disabled={isSubmitting}
                        {...register("author", {
                          required: "Author is required",
                        })}
                      />
                      {errors.author && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.author.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of the post"
                      {...register("description")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technology">
                              Technology
                            </SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="ideas">Ideas</SelectItem>
                            <SelectItem value="tutorial">Tutorial</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="metaTitle"
                        placeholder="SEO title"
                        {...register("meta_title")}
                      />
                      {/* <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setValue("meta_title", suggestedMetaTitle)
                        }
                        disabled={!suggestedMetaTitle}
                      >
                        Use Suggested
                      </Button> */}
                    </div>
                    {/* {suggestedMetaTitle && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Suggested: {suggestedMetaTitle}
                      </p>
                    )} */}
                  </div>
                  <div>
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <div className="flex items-center gap-2">
                      <Textarea
                        id="metaDescription"
                        placeholder="SEO description"
                        {...register("meta_description")}
                      />
                      {/* <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setValue("meta_description", suggestedMetaDescription)
                        }
                        disabled={!suggestedMetaDescription}
                      >
                        Use Suggested
                      </Button> */}
                    </div>
                    {/* {suggestedMetaDescription && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Suggested: {suggestedMetaDescription}
                      </p>
                    )} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
