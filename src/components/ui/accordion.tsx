"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
}

interface AccordionItemProps {
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

const AccordionContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

export function Accordion({ children, className }: AccordionProps) {
  return <div className={cn("space-y-4", className)}>{children}</div>;
}

export function AccordionItem({
  children,
  className,
  defaultOpen = false,
}: AccordionItemProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <AccordionContext.Provider value={{ open, setOpen }}>
      <div
        className={cn(
          "flex flex-col rounded-lg border bg-card",
          className
        )}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export function AccordionTrigger({
  children,
  className,
}: AccordionTriggerProps) {
  const { open, setOpen } = React.useContext(AccordionContext);

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        "flex cursor-pointer list-none items-center justify-between gap-6 p-4",
        className
      )}
    >
      {children}
      <ChevronDown
        className={cn(
          "h-5 w-5 text-muted-foreground transition-transform duration-200",
          open && "rotate-180"
        )}
      />
    </button>
  );
}

export function AccordionContent({
  children,
  className,
}: AccordionContentProps) {
  const { open } = React.useContext(AccordionContext);

  if (!open) return null;

  return (
    <div className={cn("border-t p-4", className)}>{children}</div>
  );
}

