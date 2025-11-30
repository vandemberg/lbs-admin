"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Module } from "@/types/module";

interface SortableModuleItemProps {
  module: Module;
  moduleIndex: number;
  children: (props: {
    attributes: any;
    listeners: any;
    isDragging: boolean;
  }) => React.ReactNode;
}

export function SortableModuleItem({
  module,
  moduleIndex,
  children,
}: SortableModuleItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
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
      {children({ attributes, listeners, isDragging })}
    </div>
  );
}

