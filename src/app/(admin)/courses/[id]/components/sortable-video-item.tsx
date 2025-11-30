"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Video } from "@/types/video";
import { Module } from "@/types/module";
import { Button } from "@/components/ui/button";
import { FileText, StickyNote } from "lucide-react";
import Link from "next/link";

interface SortableVideoItemProps {
  video: Video;
  module: Module;
  moduleIndex: number;
  videoIndex: number;
  courseId: string;
  formatTime: (seconds: number | undefined) => string;
  onEdit: (video: Video, module: Module) => void;
  onDelete: (module: Module, video: Video) => void;
}

export function SortableVideoItem({
  video,
  module,
  moduleIndex,
  videoIndex,
  courseId,
  formatTime,
  onEdit,
  onDelete,
}: SortableVideoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `video-${video.id}`,
    data: {
      type: "video",
      video,
      moduleId: module.id,
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
      className={`flex items-center justify-between gap-4 border-b border-dashed py-3 ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      <div className="flex items-center gap-4 flex-1">
        <div
          {...attributes}
          {...listeners}
          className="touch-none cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-destructive">
          <svg
            fill="currentColor"
            height="28"
            viewBox="0 0 24 24"
            width="28"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.267,4,12,4,12,4S5.733,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.733,2,12,2,12s0,4.267,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.733,20,12,20,12,20s6.267,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.267,22,12,22,12S22,7.733,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z"></path>
          </svg>
        </div>
        <div className="flex flex-col justify-center flex-1">
          <p className="font-medium line-clamp-1">{video.title}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">
            Vídeo {moduleIndex + 1}.{videoIndex + 1} • {formatTime(video.time_in_seconds)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link
              href={`/courses/${courseId}/modules/${module.id}/videos/${video.id}/resources`}
            >
              <FileText className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link
              href={`/courses/${courseId}/modules/${module.id}/videos/${video.id}/annotations`}
            >
              <StickyNote className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(video, module)}
          className="text-primary"
        >
          Editar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(module, video)}
          className="text-destructive/80 hover:text-destructive"
        >
          Remover
        </Button>
      </div>
    </div>
  );
}

