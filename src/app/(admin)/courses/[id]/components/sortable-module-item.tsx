"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Module } from "@/types/module";
import type { UseSortableArguments } from "@dnd-kit/sortable";

interface SortableModuleItemProps {
  module: Module;
  moduleIndex: number;
  children: (props: {
    attributes: UseSortableArguments["attributes"];
    isDragging: boolean;
  }) => React.ReactNode;
}

export function SortableModuleItem({
  module,
  moduleIndex: _moduleIndex,
  children,
}: SortableModuleItemProps) {
  // moduleIndex is used for potential future sorting features
  void _moduleIndex;
  const { attributes, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: `module-${module.id}`,
      data: {
        type: "module",
        module,
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? "cursor-grabbing" : ""}`}
    >
      {children({ attributes, isDragging })}
    </div>
  );
}

