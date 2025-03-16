"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { FileUpload } from "./file-upload";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

interface ImportExportDataProps {
  subdomain: string;
}

export function ImportExportData({ subdomain }: ImportExportDataProps) {
  const [file, setFile] = useState<File | null>(null);
  const [imageZip, setImageZip] = useState<File | null>(null);
  const [keepExistingData, setKeepExistingData] = useState(false);
  const [loading, setLoading] = useState({
    exportData: false,
    importData: false,
    exportImages: false,
    importImages: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [showImportExport, setShowImportExport] = useState(false);
  const [dataFileKey, setDataFileKey] = useState(Date.now().toString());
  const [imageFileKey, setImageFileKey] = useState(Date.now().toString());
  const [hasImages, setHasImages] = useState<boolean | null>(null);
  const [hasData, setHasData] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check resources in one request
    const checkResources = async () => {
      if (!subdomain) return;

      try {
        const response = await fetch(
          `/api/check-resources?subdomain=${subdomain}`
        );
        if (!response.ok) throw new Error("Failed to check resources");
        const data = await response.json();
        setHasImages(data.hasImages);
        setHasData(data.hasData);
      } catch (error) {
        console.error("Error checking resources:", error);
        setHasImages(false);
        setHasData(false);
      }
    };

    checkResources();
  }, [subdomain]);

  const handleLoadingState = (action: keyof typeof loading, state: boolean) => {
    setLoading((prev) => ({ ...prev, [action]: state }));
  };

  const handleExport = async () => {
    if (!subdomain || !hasData) return;
    handleLoadingState("exportData", true);
    setError(null);
    try {
      const response = await fetch(`/api/export-data?subdomain=${subdomain}`);
      if (!response.ok) throw new Error("Export failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${subdomain}-blog_data.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast({ title: "Success", description: "Data exported successfully" });
    } catch (error) {
      console.error("Error exporting data:", error);
      setError("Failed to export data");
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      });
    } finally {
      handleLoadingState("exportData", false);
    }
  };

  const handleImport = async () => {
    if (!file || !subdomain) return;
    handleLoadingState("importData", true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("subdomain", subdomain);
    formData.append("keepExistingData", keepExistingData.toString());

    try {
      const response = await fetch("/api/import-data", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Import failed");
      toast({ title: "Success", description: "Data imported successfully" });
      setFile(null);
      setDataFileKey(Date.now().toString()); // Force re-render of FileUpload
    } catch (error) {
      console.error("Error importing data:", error);
      setError("Failed to import data");
      toast({
        title: "Error",
        description: "Failed to import data",
        variant: "destructive",
      });
    } finally {
      handleLoadingState("importData", false);
    }
  };

  const handleExportImage = async () => {
    if (!subdomain || !hasImages) return;
    handleLoadingState("exportImages", true);
    setError(null);
    try {
      const response = await fetch(`/api/export-images?subdomain=${subdomain}`);
      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${subdomain}-blog-images.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast({ title: "Success", description: "Images exported successfully" });
    } catch (error) {
      console.error("Error exporting images:", error);
      setError("Failed to export images");
      toast({
        title: "Error",
        description: "Failed to export images",
        variant: "destructive",
      });
    } finally {
      handleLoadingState("exportImages", false);
    }
  };

  const handleImportImages = async () => {
    if (!imageZip || !subdomain) return;
    handleLoadingState("importImages", true);
    setError(null);
    const formData = new FormData();
    formData.append("file", imageZip);
    formData.append("subdomain", subdomain);
    try {
      const response = await fetch("/api/import-images", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Import failed");
      toast({ title: "Success", description: "Images imported successfully" });
      setImageZip(null);
      setImageFileKey(Date.now().toString()); // Force re-render of FileUpload
    } catch (error) {
      console.error("Error importing images:", error);
      setError("Failed to import images");
      toast({
        title: "Error",
        description: "Failed to import images",
        variant: "destructive",
      });
    } finally {
      handleLoadingState("importImages", false);
    }
  };

  if (!subdomain) {
    console.error("Subdomain not provided.");
    return <div>You must be authenticated to access this feature.</div>;
  }

  return (
    <div className="space-y-6 max-w-md">
      <h2 className="text-xl font-bold">Import/Export Data</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex items-center space-x-2">
        <div className="relative inline-grid h-5 grid-cols-[1fr_1fr] items-center text-sm font-medium">
          <Switch
            id="import-export"
            checked={showImportExport}
            onCheckedChange={setShowImportExport}
            className="peer absolute inset-0 h-[inherit] w-auto rounded-lg data-[state=unchecked]:bg-input/50 [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:rounded-md [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] data-[state=checked]:[&_span]:translate-x-full rtl:data-[state=checked]:[&_span]:-translate-x-full"
          />

          <span className="min-w-78 flex pointer-events-none relative ms-0.5 items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full rtl:peer-data-[state=unchecked]:-translate-x-full" />
        </div>
        <Label htmlFor="import-export" className="cursor-pointer">
          Import/Export Data
        </Label>
      </div>
      {showImportExport && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Button
              className="w-full"
              onClick={handleExport}
              disabled={
                !hasData ||
                loading.exportData ||
                loading.importData ||
                loading.exportImages ||
                loading.importImages
              }
            >
              {loading.exportData ? "Exporting..." : "Export Data"}
            </Button>
            <Button
              className="w-full"
              onClick={handleExportImage}
              disabled={
                !hasImages ||
                loading.exportData ||
                loading.importData ||
                loading.exportImages ||
                loading.importImages
              }
            >
              {loading.exportImages ? "Exporting..." : "Export Images"}
            </Button>
          </div>
          {hasData === false && (
            <p className="text-sm text-yellow-600">
              No data available to export.
            </p>
          )}
          {hasImages === false && (
            <p className="text-sm text-yellow-600">
              No images available to export.
            </p>
          )}
          <div className="space-y-4">
            <FileUpload
              key={dataFileKey}
              onFileSelect={setFile}
              accept=".json"
              label="JSON file"
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="keepExistingData"
                checked={keepExistingData}
                onCheckedChange={(checked: boolean) =>
                  setKeepExistingData(checked as boolean)
                }
              />
              <label
                htmlFor="keepExistingData"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed cursor-pointer peer-disabled:opacity-70"
              >
                Keep existing data
              </label>
            </div>
            <Button
              className="w-full"
              onClick={handleImport}
              disabled={
                !file ||
                loading.exportData ||
                loading.importData ||
                loading.exportImages ||
                loading.importImages
              }
            >
              {loading.importData ? "Importing..." : "Import Data"}
            </Button>
          </div>
          <div className="space-y-4">
            <FileUpload
              key={imageFileKey}
              onFileSelect={setImageZip}
              accept=".zip"
              label="ZIP file"
            />
            <Button
              className="w-full"
              onClick={handleImportImages}
              disabled={
                !imageZip ||
                loading.exportData ||
                loading.importData ||
                loading.exportImages ||
                loading.importImages
              }
            >
              {loading.importImages ? "Importing..." : "Import Images"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
