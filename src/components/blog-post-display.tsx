"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { navigation } from "@/lib/constants";
import { handleError } from "@/lib/helper";
import type { BlogPost, TabType } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { Content } from "@tiptap/react";
import { Loader2, Menu, PencilLine, Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import triggerPurge from "../lib/trigger-purge";
import BlogPostItem from "./blog-post-item";
import BlogPostSearch from "./blog-post-search";
import BlogPostStats from "./blog-post-stats";
import CustomDomain from "./custom-domain";
import DeleteConfirmationDialog from "./delete-confirmation";
import FullScreenEditor from "./fullscreen-editor";
import { ImportExportData } from "./import-export";
import ProfileSettings from "./profile-settings";
import { useAuth } from "./providers/auth-context";
import { Separator } from "./ui/separator";
import { IosSpinner } from "./ui/spinner";

export default function BlogPostDisplay() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [content, setContent] = useState<Content>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    slug: string | null;
  }>({
    isOpen: false,
    slug: null,
  });
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [customDomain, setCustomDomain] = useState<string | null>(null);
  const [stats, setStats] = useState({
    published: 0,
    drafts: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [authors, setAuthors] = useState<
    Array<{ name: string; is_primary: boolean }>
  >([]);
  const [newCategory, setNewCategory] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const { isAuthenticated, logout, user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isEditing = searchParams.get("edit") === "true";

  const defaultFormValues = {
    title: "",
    slug: "",
    label: "",
    author: "",
    description: "",
    category: "",
    meta_title: "",
    meta_description: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<BlogPost>({
    mode: "onChange",
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    fetchStats();
  }, [posts]);

  const fetchStats = () => {
    const publishedCount = posts.filter((post) => !post.is_draft).length;
    const draftsCount = posts.filter((post) => post.is_draft).length;
    setStats({ published: publishedCount, drafts: draftsCount });
  };

  const title = watch("title");

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  useEffect(() => {
    if (title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setValue("slug", generatedSlug);
    }
  }, [title, setValue]);

  useEffect(() => {
    if (user?.subdomain) {
      const fetchCustomDomain = async () => {
        try {
          const response = await fetch(
            `/api/get-custom-domain?subdomain=${user.subdomain}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch custom domain");
          }
          const data = await response.json();
          setCustomDomain(data.customDomain);
        } catch (error) {
          console.error("Error fetching custom domain:", error);
        }
      };
      fetchCustomDomain();
    }
  }, [user]);

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

  // Add new category handler
  const addNewCategory = useCallback(async () => {
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
      }
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  }, [newCategory, user?.subdomain]);

  // Add new author handler
  const addNewAuthor = useCallback(
    async (isPrimary: boolean) => {
      if (!newAuthor.trim() || !user?.subdomain) return;

      try {
        const response = await fetch(
          `/api/authors?subdomain=${user.subdomain}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: newAuthor.trim(),
              isPrimary,
            }),
          }
        );

        if (response.ok) {
          const updated = await fetch(
            `/api/authors?subdomain=${user.subdomain}`
          );
          const data = await updated.json();
          setAuthors(data);
          setNewAuthor("");
        }
      } catch (error) {
        console.error("Failed to add author:", error);
      }
    },
    [newAuthor, user?.subdomain]
  );

  const fetchPosts = async () => {
    if (!user?.subdomain) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/posts?subdomain=${user.subdomain}`);
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      handleError(error, toast);
    } finally {
      setIsLoading(false);
    }
  };

  const resetFormAndEditor = () => {
    // setIsEditing(false);
    setCurrentPost(null);
    reset(defaultFormValues); // Reset to explicit default values
    setContent("");
  };

  const handleAddPost = async (data: BlogPost, isDraft = false) => {
    if (!user || !user.subdomain) {
      toast({
        title: "Error",
        description: "Unable to create post. Subdomain not found.",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/posts?subdomain=${user.subdomain}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          content: content,
          created_at: new Date().toISOString(),
          ...(isDraft ? {} : { published_at: new Date().toISOString() }),
          content_preview: content?.toString().slice(0, 200),
          is_draft: isDraft,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create post");
      }

      const newPost = await response.json();

      const purgeSuccess = await triggerPurge(
        `/${user.subdomain}/blog/${data.slug}`,
        "blog-posts"
      );

      await triggerPurge(`/${user.subdomain}`, "blog-posts");

      toast({
        title: "Success",
        description:
          `Post ${isDraft ? "saved as draft" : "published"} successfully` +
          (!purgeSuccess ? " (cache purge failed)" : ""),
        variant: purgeSuccess ? "default" : "destructive",
      });

      // Reset the form and editor
      resetFormAndEditor();
      await fetchPosts(); // Refresh the posts list
      router.back();
    } catch (error) {
      handleError(error, toast);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPost = async (updatedData: BlogPost, isDraft = false) => {
    if (!currentPost || !user?.subdomain) return;

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `/api/posts/${currentPost.slug}?subdomain=${user.subdomain}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...updatedData,
            content: content,
            updated_at: new Date().toISOString(),
            content_preview: content?.toString().slice(0, 200),
            is_draft: isDraft,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      const purgeSuccess = await triggerPurge(
        `/${user.subdomain}/blog/${updatedData.slug}`,
        "blog-posts"
      );

      await triggerPurge(`/${user.subdomain}`, "blog-posts");

      toast({
        title: "Success",
        description:
          `Post ${isDraft ? "saved as draft" : "updated"} successfully` +
          (!purgeSuccess ? " (cache purge failed)" : ""),
        variant: purgeSuccess ? "default" : "destructive",
      });

      // Reset the form and editor
      resetFormAndEditor();
      await fetchPosts(); // Refresh the posts list
      router.back();
    } catch (error) {
      handleError(error, toast);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = (data: BlogPost) => {
    if (currentPost) {
      handleEditPost(data, true);
    } else {
      handleAddPost(data, true);
    }
  };

  const handlePublishDraft = async (post: BlogPost) => {
    if (!user?.subdomain) return;
    try {
      setIsSubmitting(true);
      const response = await fetch(
        `/api/posts/${post.slug}?subdomain=${user.subdomain}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...post,
            is_draft: false,
            published_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to publish draft");
      }

      const purgeSuccess = await triggerPurge(
        `/${user.subdomain}/blog/${post.slug}`,
        "blog-posts"
      );

      await triggerPurge(`/${user.subdomain}`, "blog-posts");
      toast({
        title: "Success",
        description: `Post published successfully${
          !purgeSuccess ? " (cache purge failed)" : ""
        }`,
        variant: purgeSuccess ? "default" : "destructive",
      });

      await fetchPosts();
    } catch (error) {
      handleError(error, toast);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditorForAdd = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("edit", "true");
    router.push(`?${params.toString()}`, { scroll: false });
    resetFormAndEditor();
  };

  const openEditorForEdit = (post: BlogPost) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("edit", "true");
    router.push(`?${params.toString()}`, { scroll: false });
    setCurrentPost(post);
    reset(post);
    setContent(post.content);
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    router.back();
    resetFormAndEditor();
  };

  const initiateDelete = (slug: string) => {
    setDeleteConfirmation({
      isOpen: true,
      slug: slug,
    });
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteConfirmation.slug || !user?.subdomain) return;

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `/api/posts/${deleteConfirmation.slug}?subdomain=${user.subdomain}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      const purgeSuccess = await triggerPurge(
        `/${user.subdomain}/blog/${deleteConfirmation.slug}`,
        "blog-posts"
      );

      await triggerPurge(`/${user.subdomain}`, "blog-posts");
      toast({
        title: "Success",
        description:
          "Post deleted successfully" +
          (!purgeSuccess ? " (cache purge failed)" : ""),
        variant: purgeSuccess ? "default" : "destructive",
      });

      await fetchPosts();
      const params = new URLSearchParams(searchParams.toString());
      params.delete("edit");
      // Replace current history entry with clean URL
      router.replace(`?${params.toString()}`, { scroll: false });
    } catch (error) {
      handleError(error, toast);
    } finally {
      setIsSubmitting(false);
      setDeleteConfirmation({ isOpen: false, slug: null });
    }
  };

  const handleDeleteCancelled = () => {
    setDeleteConfirmation({ isOpen: false, slug: null });
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [posts, searchTerm]);

  const renderPostItem = (post: BlogPost, isDraft = false) => (
    <BlogPostItem
      key={post.id}
      post={post}
      isDraft={isDraft}
      subdomain={user?.subdomain || ""}
      onEdit={() => openEditorForEdit(post)}
      onDelete={() => initiateDelete(post.slug)}
      onPublish={() => handlePublishDraft(post)}
    />
  );

  const renderDashboard = () => (
    <div className="space-y-8">
      <BlogPostStats published={stats.published} drafts={stats.drafts} />
      <Card className="h-full shadow-none border-none">
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-400px)] visible">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <IosSpinner />
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.length === 0 && !isLoading && (
                  <div className="text-center text-zinc-500">
                    No posts found.
                  </div>
                )}
                {filteredPosts.map((post) =>
                  renderPostItem(post, post.is_draft)
                )}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "posts":
      case "drafts":
        return (
          <Card className="h-full shadow-none border-none space-y-3">
            <CardHeader>
              <CardTitle className="mb-2">
                {activeTab === "posts" ? "Published Posts" : "Draft Posts"}
              </CardTitle>
              <BlogPostSearch
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-340px)]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredPosts.length === 0 && !isLoading && (
                      <div className="text-center text-zinc-500">
                        No posts found.
                      </div>
                    )}
                    {filteredPosts
                      .filter((post) =>
                        activeTab === "posts" ? !post.is_draft : post.is_draft
                      )
                      .map((post) =>
                        renderPostItem(post, activeTab === "drafts")
                      )}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        );
      case "settings":
        return (
          <Card className="h-full shadow-none border-none">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="grid lg:grid-cols-2 gap-4 lg:gap-8">
              <div>
                <ScrollArea className="h-[calc(100vh-240px)]">
                  <div className="space-y-4 lg:space-y-8 flex flex-col">
                    {!customDomain && (
                      <CustomDomain subdomain={user?.subdomain || ""} />
                    )}
                    <ImportExportData subdomain={user?.subdomain || ""} />
                  </div>
                </ScrollArea>
              </div>
              <ProfileSettings />
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)] bg-background">
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 pt-8 h-[100vh] w-64 transform bg-background transition-transform duration-200 ease-in-out border-r",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:relative md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col p-4">
          <Link
            title="brand-logo"
            className="relative ps-2 pt-2 flex items-center space-x-2"
            href="/"
          >
            <PencilLine />
            <span className="font-semibold text-2xl ">Inscribe beta</span>
          </Link>
          <Separator />
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl pl-3 pt-4 font-bold">Blog Manager</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          <nav className="space-y-2">
            {navigation.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            ))}
          </nav>
          <div className="border-t mt-auto mb-6 pt-4 space-y-2">
            <Link href={`/${user?.subdomain}`} prefetch>
              <Button className="w-full" variant="secondary">
                View Blog
              </Button>
            </Link>
            {isAuthenticated && (
              <Button onClick={logout} className="w-full">
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex w-full pt-8 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden"
              disabled={isSubmitting}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="ml-4 text-lg font-semibold">
              {navigation.find((item) => item.id === activeTab)?.name}
            </h1>
          </div>
          {activeTab !== "settings" && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={fetchPosts}
                className="flex items-center justify-center"
                disabled={isLoading || isSubmitting}
              >
                <RefreshCw
                  className={cn(
                    "h-4 w-4",
                    (isLoading || isSubmitting) && "animate-spin"
                  )}
                />
              </Button>
              <Button
                variant="default"
                onClick={openEditorForAdd}
                disabled={isSubmitting}
              >
                <Plus className="mr-2 h-5 w-5" /> New Post
              </Button>
            </div>
          )}
        </header>
        <main className="flex-1 overflow-auto py-4 sm:p-8">
          {isEditing ? (
            <FullScreenEditor
              currentPost={currentPost}
              content={content}
              setContent={setContent}
              onSubmit={handleSubmit((data) =>
                currentPost ? handleEditPost(data) : handleAddPost(data)
              )}
              onSaveDraft={handleSubmit(handleSaveDraft)}
              onCancel={handleCancel}
              register={register}
              errors={errors}
              reset={reset}
              watch={watch}
              setValue={setValue}
              control={control}
              isSubmitting={isSubmitting}
              isValid={isValid}
              subdomain={user?.subdomain || ""}
            />
          ) : (
            renderContent()
          )}
        </main>
      </div>

      <DeleteConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleDeleteCancelled();
        }}
        isSubmitting={isSubmitting}
        onDeleteConfirmed={handleDeleteConfirmed}
        onDeleteCancelled={handleDeleteCancelled}
      />
    </div>
  );
}
