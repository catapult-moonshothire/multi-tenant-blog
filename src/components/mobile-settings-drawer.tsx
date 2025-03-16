import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Settings } from "lucide-react";
import type React from "react";

interface MobileSettingsDrawerProps {
  children: React.ReactNode;
}

export function MobileSettingsDrawer({ children }: MobileSettingsDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-4 right-4 rounded-full sm:hidden"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>Post Settings</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-full py-4">{children}</ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
