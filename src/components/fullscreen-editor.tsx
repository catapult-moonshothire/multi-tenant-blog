"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { capitalizeFirstLetter } from "@/lib/helper";
import { FullScreenEditorProps } from "@/lib/types";
import { Loader, Plus, Settings, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { MinimalTiptapEditor } from "./minimal-tiptap";
import { useAuth } from "./providers/auth-context";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [authors, setAuthors] = useState<
    Array<{ name: string; is_primary: boolean }>
  >([]);
  const [newCategory, setNewCategory] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [isPrimaryAuthor, setIsPrimaryAuthor] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [authorDialogOpen, setAuthorDialogOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();

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

  // Fetch categories and authors
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.subdomain) return;

      try {
        // Fetch categories
        const categoriesRes = await fetch(
          `/api/categories?subdomain=${user.subdomain}`
        );
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.map((c: any) => c.name));

        // Fetch authors
        const authorsRes = await fetch(
          `/api/authors?subdomain=${user.subdomain}`
        );
        const authorsData = await authorsRes.json();
        setAuthors(authorsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [user?.subdomain]);

  // Reset input states when opening dialogs
  useEffect(() => {
    if (categoryDialogOpen) {
      setNewCategory("");
    }
  }, [categoryDialogOpen]);

  useEffect(() => {
    if (authorDialogOpen) {
      setNewCategory("");
      setIsPrimaryAuthor(false);
    }
  }, [authorDialogOpen]);

  // Add new category handler
  const addNewCategory = async () => {
    if (!newCategory.trim() || !user?.subdomain) return;

    try {
      const response = await fetch(
        `/api/categories?subdomain=${user.subdomain}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newCategory.trim() }),
        }
      );

      if (response.ok) {
        const updated = await fetch(
          `/api/categories?subdomain=${user.subdomain}`
        );
        const data = await updated.json();
        setCategories(data.map((c: any) => c.name));
        setNewCategory("");
        setCategoryDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  };

  // Add new author handler
  const addNewAuthor = async () => {
    if (!newAuthor.trim() || !user?.subdomain) return;

    try {
      const response = await fetch(`/api/authors?subdomain=${user.subdomain}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newAuthor.trim(),
          isPrimary: isPrimaryAuthor,
        }),
      });

      if (response.ok) {
        const updated = await fetch(`/api/authors?subdomain=${user.subdomain}`);
        const data = await updated.json();
        setAuthors(data);
        setNewAuthor("");
        setIsPrimaryAuthor(false);
        setAuthorDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to add author:", error);
    }
  };

  // Helper function for input changes that won't disrupt dialogs
  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory(e.target.value);
  };

  const handleNewAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAuthor(e.target.value);
  };

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
      const suggestedTitle = `${title} | ${capitalizeFirstLetter(subdomain)}`; // Customize this as needed
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

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any form submission
    e.stopPropagation(); // Stop event propagation
    setIsDrawerOpen(true);
  };

  // Handle opening dialogs separately from dropdown state
  const handleOpenCategoryDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCategoryDialogOpen(true);
  };

  const handleOpenAuthorDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAuthorDialogOpen(true);
  };

  // Settings Panel Content (used in both desktop sidebar and mobile drawer)
  const SettingsContent = () => (
    <div className="space-y-6">
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
                  message: "Slug must be lowercase, numbers, and hyphens only",
                },
              }}
              render={({ field }) => (
                <Input id="slug" placeholder="post-url-slug" {...field} />
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
          <div className="mb-4 grid grid-cols-2 gap-2">
            <div className="mb-4">
              <Label htmlFor="author-select">Author</Label>
              <Controller
                name="author"
                control={control}
                rules={{ required: "Author is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="author-select">
                      <SelectValue placeholder="Select author" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors?.map((author) => (
                        <SelectItem
                          className="w-full"
                          key={author.name}
                          value={author.name}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{author.name}</span>
                            {!!author.is_primary && (
                              <Badge variant="success">Primary</Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                      <div className="w-full p-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full flex items-center gap-2"
                          onClick={handleOpenAuthorDialog}
                          type="button"
                        >
                          <Plus className="h-4 w-4" />
                          Add New Author
                        </Button>
                      </div>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.author && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.author.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="category-select">Category</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger id="category-select">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      <div className="w-full p-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full flex items-center gap-2"
                          onClick={handleOpenCategoryDialog}
                          type="button"
                        >
                          <Plus className="h-4 w-4" />
                          Add New Category
                        </Button>
                      </div>
                    </SelectContent>
                  </Select>
                )}
              />
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
          <div className="flex items-center h-12 gap-2">
            <div className="flex items-center min-w-fit space-x-2">
              <div className="relative inline-grid h-5 grid-cols-[1fr_1fr] items-center text-sm font-medium">
                <Switch
                  id="add-lebel"
                  checked={showLabel}
                  onCheckedChange={setShowLabel}
                  className="peer absolute inset-0 h-[inherit] w-auto rounded-lg data-[state=unchecked]:bg-input/50 [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:rounded-md [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] data-[state=checked]:[&_span]:translate-x-full rtl:data-[state=checked]:[&_span]:-translate-x-full"
                />

                <span className="min-w-78 flex pointer-events-none relative ms-0.5 items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full rtl:peer-data-[state=unchecked]:-translate-x-full" />
              </div>
              <Label htmlFor="add-lebel" className="cursor-pointer">
                Add Label
              </Label>
            </div>
            {showLabel && (
              <Input
                placeholder="Label (e.g., New)"
                disabled={isSubmitting}
                {...register("label")}
              />
            )}
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
            </div>
          </div>
          <div>
            <Label htmlFor="metaDescription">Meta Description</Label>
            <div className="flex items-center gap-2">
              <Textarea
                id="metaDescription"
                placeholder="SEO description"
                {...register("meta_description")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between border-b p-4">
          <h2 className="text-2xl font-bold">
            {currentPost ? "Edit Post" : "New Post"}
          </h2>
          <div className="flex items-center gap-2">
            {(!currentPost || !!currentPost.is_draft) && (
              <Button
                variant="outline"
                onClick={onSaveDraft}
                disabled={isSubmitting}
                type="button"
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
              type="button"
            >
              <X className="h-5 w-5 text-red-600 font-bold" />
            </Button>
          </div>
        </header>
        <form
          className="flex flex-1 max-sm:flex-col"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex-1 max-sm:w-full overflow-auto p-4">
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
              className="min-h-[500px]"
              editorContentClassName="prose max-w-none h-full"
              output="html"
              placeholder="Start writing your post..."
              autofocus={true}
              editable={!isSubmitting}
            />
          </div>

          {/* Desktop sidebar - Only visible on sm and larger screens */}
          <div className="hidden sm:block sm:w-80 lg:w-96 border-l overflow-y-auto">
            <div className="p-4">
              <SettingsContent />
            </div>
          </div>

          {/* Mobile floating button - Only visible on smaller than sm screens */}
          <div className="sm:hidden">
            <Button
              onClick={handleSettingsClick}
              className="fixed bottom-6 flex items-center justify-center gap-2 right-6 z-10 rounded-full w-fit shadow-lg !px-6 p-3"
              size="icon"
              type="button" // Explicitly set as button type to prevent form submission
            >
              {" "}
              Post Settings
              <Settings className="size-4" />
            </Button>

            {/* Mobile drawer with combined settings */}
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerContent>
                <DrawerHeader className="border-b">
                  <DrawerTitle>Post Settings</DrawerTitle>
                  <DrawerClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-4"
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </DrawerClose>
                </DrawerHeader>
                <ScrollArea className="h-[70vh] px-4 py-2">
                  <SettingsContent />
                </ScrollArea>
              </DrawerContent>
            </Drawer>
          </div>
        </form>

        {/* Category Dialog - Placed outside the form to prevent form interaction issues */}
        <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-category">Category Name</Label>
                <Input
                  id="new-category"
                  placeholder="Enter category name"
                  value={newCategory}
                  onChange={handleNewCategoryChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setCategoryDialogOpen(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button onClick={addNewCategory} type="button">
                Add Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Author Dialog - Placed outside the form to prevent form interaction issues */}
        <Dialog open={authorDialogOpen} onOpenChange={setAuthorDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Author</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-author">Author Name</Label>
                <Input
                  id="new-author"
                  placeholder="Enter author name"
                  value={newAuthor}
                  onChange={handleNewAuthorChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="primary-author"
                  checked={isPrimaryAuthor}
                  onCheckedChange={setIsPrimaryAuthor}
                />
                <Label htmlFor="primary-author">Set as primary author</Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setAuthorDialogOpen(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button onClick={addNewAuthor} type="button">
                Add Author
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
