"use client";

import { useQuery } from "@tanstack/react-query";
import lbsHttp from "@/services/external-api";
import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ModuleForm } from "./components/module-form";
import { VideoForm } from "./components/video-form";
import { QuizSection } from "./components/quiz-section";
import {
  Edit,
  Trash2,
  GripVertical,
  Eye,
  Save,
} from "lucide-react";
import Link from "next/link";
import { EditModuleDialog } from "@/app/(admin)/courses/[id]/components/edit-module-dialog";
import { EditVideoDialog } from "@/app/(admin)/courses/[id]/components/edit-video-dialog";
import { Module } from "@/types/module";
import { Video } from "@/types/video";
import { queryClient } from "@/lib/react-query";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableVideoItem } from "./components/sortable-video-item";
import { SortableModuleItem } from "./components/sortable-module-item";

// Função para formatar segundos em horas:minutos:segundos
const formatTime = (seconds: number | undefined): string => {
  if (!seconds) return "-";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours =
    hours > 0 ? `${hours.toString().padStart(2, "0")}:` : "";
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

  return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
};

export default function CoursePage() {
  const { id } = useParams();
  const [openEditModuleDialog, setOpenEditModuleDialog] = useState(false);
  const [openEditVideoDialog, setOpenEditVideoDialog] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(
    new Set()
  );
  const [, setActiveId] = useState<string | null>(null);

  const { data: course, isLoading } = useQuery({
    queryKey: ["courses", id],
    queryFn: () => lbsHttp.fetchCourseById(Number(id)),
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sortedModules = useMemo(() => {
    if (!course?.modules) return [];
    return [...course.modules].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [course]);
  
  // Criar um mapa de todos os vídeos para facilitar acesso
  const allVideos = useMemo(() => {
    return sortedModules.flatMap((module) =>
      module.videos.map((video) => ({
        ...video,
        moduleId: module.id,
      }))
    );
  }, [sortedModules]);

  // Obter todos os IDs de vídeos para o SortableContext
  const videoIds = useMemo(() => {
    return allVideos.map((video) => `video-${video.id}`);
  }, [allVideos]);

  // Obter todos os IDs de módulos para o SortableContext
  const moduleIds = useMemo(() => {
    return sortedModules.map((module) => `module-${module.id}`);
  }, [sortedModules]);

  if (Number.isNaN(Number(id))) {
    return <div>Invalid course ID</div>;
  }

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  const handleEditModule = (module: Module) => {
    setSelectedModule(module);
    setOpenEditModuleDialog(true);
  };

  const handleRemoveModule = (module: Module) => {
    if (!window.confirm("Tem certeza que deseja remover este módulo?")) {
      return;
    }

    lbsHttp
      .removeModule(Number(id), module.id)
      .then(() => {
        toast.success("Módulo removido com sucesso");
        queryClient.invalidateQueries({
          queryKey: ["courses", id],
        });
      })
      .catch(() => {
        toast.error("Erro ao remover o módulo");
      });
  };

  const handleEditVideo = (video: Video, module: Module) => {
    setSelectedVideo(video);
    setSelectedModule(module);
    setOpenEditVideoDialog(true);
  };

  const handleDeleteVideo = (module: Module, video: Video) => {
    if (!window.confirm("Tem certeza que deseja remover este vídeo?")) {
      return;
    }

    lbsHttp.deleteVideo(Number(id), module.id, video.id);
    toast.success("Vídeo removido com sucesso");
    queryClient.invalidateQueries({
      queryKey: ["courses", id],
    });
  };

  const toggleModule = (moduleId: number) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || !course) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Verificar se é um módulo sendo arrastado
    if (activeId.startsWith("module-") && overId.startsWith("module-")) {
      const activeModuleId = parseInt(activeId.replace("module-", ""));
      const overModuleId = parseInt(overId.replace("module-", ""));

      if (activeModuleId === overModuleId) return;

      // Encontrar os módulos envolvidos
      const activeModule = course.modules?.find((m) => m.id === activeModuleId);
      const overModule = course.modules?.find((m) => m.id === overModuleId);

      if (!activeModule || !overModule) return;

      // Encontrar todos os módulos (excluindo o módulo sendo movido)
      const otherModules = (course.modules || []).filter(
        (m) => m.id !== activeModuleId
      );

      // Encontrar a posição do módulo de destino
      const overIndex = otherModules.findIndex((m) => m.id === overModuleId);

      // Criar nova lista com o módulo movido na posição correta
      const newModules = [...otherModules];
      newModules.splice(overIndex, 0, activeModule);

      // Preparar dados para a API - todos os módulos com nova ordem
      const reorderData = newModules.map((module, index) => ({
        id: module.id,
        order: index + 1,
      }));

      try {
        await lbsHttp.reorderModules(Number(id), reorderData);
        toast.success("Ordem dos módulos atualizada com sucesso");
        queryClient.invalidateQueries({
          queryKey: ["courses", id],
        });
      } catch (error) {
        toast.error("Erro ao atualizar ordem dos módulos");
        console.error(error);
      }
      return;
    }

    // Lógica para vídeos (mantida como estava)
    if (activeId.startsWith("video-") && overId.startsWith("video-")) {
      const activeVideoId = parseInt(activeId.replace("video-", ""));
      const overVideoId = parseInt(overId.replace("video-", ""));

      if (activeVideoId === overVideoId) return;

      // Encontrar os vídeos e módulos envolvidos
      let activeVideo: Video | undefined;
      let overVideo: Video | undefined;
      let sourceModule: Module | undefined;
      let targetModule: Module | undefined;

      for (const courseModule of course.modules || []) {
        const foundActive = courseModule.videos?.find((v) => v.id === activeVideoId);
        const foundOver = courseModule.videos?.find((v) => v.id === overVideoId);

        if (foundActive) {
          activeVideo = foundActive;
          sourceModule = courseModule;
        }
        if (foundOver) {
          overVideo = foundOver;
          targetModule = courseModule;
        }
      }

      if (!activeVideo || !overVideo || !sourceModule || !targetModule) return;

      // Encontrar todos os vídeos do módulo destino (excluindo o vídeo sendo movido)
      const targetModuleVideos = (targetModule.videos || []).filter(
        (v) => v.id !== activeVideoId
      );

      // Encontrar a posição do vídeo de destino no módulo destino
      const overIndex = targetModuleVideos.findIndex(
        (v) => v.id === overVideoId
      );

      // Criar nova lista com o vídeo movido na posição correta
      const newTargetVideos = [...targetModuleVideos];
      newTargetVideos.splice(overIndex, 0, activeVideo);

      // Preparar dados para a API - todos os vídeos do módulo destino com nova ordem
      const reorderData = newTargetVideos.map((video, index) => ({
        id: video.id,
        order: index + 1,
        module_id: targetModule!.id,
      }));

      // Se o vídeo mudou de módulo, também atualizar ordem dos vídeos que ficaram no módulo original
      if (sourceModule.id !== targetModule.id) {
        const sourceModuleVideos = (sourceModule.videos || []).filter(
          (v) => v.id !== activeVideoId
        );

        const sourceReorderData = sourceModuleVideos.map((video, index) => ({
          id: video.id,
          order: index + 1,
          module_id: sourceModule.id,
        }));

        reorderData.push(...sourceReorderData);
      }

      try {
        await lbsHttp.reorderVideos(Number(id), reorderData);
        toast.success("Ordem dos vídeos atualizada com sucesso");
        queryClient.invalidateQueries({
          queryKey: ["courses", id],
        });
      } catch (error) {
        toast.error("Erro ao atualizar ordem dos vídeos");
        console.error(error);
      }
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {course?.title || "Estrutura do Curso"}
          </h1>
          <p className="text-muted-foreground">
            Gerencie os módulos e adicione vídeos do YouTube para montar seu
            curso.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href={`/courses/${id}/preview`}>
              <Eye className="h-4 w-4 mr-2" />
              Visualizar
            </Link>
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Publicar Curso
          </Button>
        </div>
      </div>

      {/* Module Form */}
      <ModuleForm courseId={Number(id)} />

      <hr className="border-border my-4" />

      {/* Modules Accordion */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={moduleIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-6">
            {sortedModules.length > 0 ? (
              sortedModules.map((module: Module, index: number) => {
                const isOpen = expandedModules.has(module.id);
                const moduleVideoIds = (module.videos || [])
                  .map((video) => `video-${video.id}`)
                  .filter((id) => videoIds.includes(id));

                return (
                  <SortableModuleItem
                    key={module.id}
                    module={module}
                    moduleIndex={index}
                  >
                    {({ attributes }) => (
                      <div className="flex flex-col rounded-xl border bg-card">
                        {/* Module Header */}
                        <div className="flex cursor-pointer list-none items-center justify-between gap-6 p-4">
                          <div className="flex items-center gap-3">
                            <div
                              {...attributes}
                              className="touch-none cursor-grab active:cursor-grabbing"
                            >
                              <GripVertical className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-base font-semibold">
                                Módulo {index + 1}: {module.name}
                              </p>
                              {module.description && (
                                <p className="text-sm text-muted-foreground">
                                  {module.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditModule(module)}
                              className="text-muted-foreground hover:text-primary"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveModule(module)}
                              className="text-destructive/80 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remover
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleModule(module.id)}
                              className="text-muted-foreground"
                            >
                              {isOpen ? "Ocultar" : "Expandir"}
                            </Button>
                          </div>
                        </div>

                        {/* Module Content */}
                        {isOpen && (
                          <div className="flex flex-col border-t p-4 md:p-6">
                            {/* Videos List */}
                            {module.videos && module.videos.length > 0 && (
                              <div className="mb-6 space-y-4">
                                <SortableContext
                                  items={moduleVideoIds}
                                  strategy={verticalListSortingStrategy}
                                >
                                  {module.videos.map(
                                    (video: Video, videoIndex: number) => (
                                      <SortableVideoItem
                                        key={video.id}
                                        video={video}
                                        module={module}
                                        moduleIndex={index}
                                        videoIndex={videoIndex}
                                        courseId={id as string}
                                        formatTime={formatTime}
                                        onEdit={handleEditVideo}
                                        onDelete={handleDeleteVideo}
                                      />
                                    )
                                  )}
                                </SortableContext>
                              </div>
                            )}

                            {/* Video Form */}
                            <VideoForm
                              moduleId={module.id}
                              onSuccess={() => {
                                queryClient.invalidateQueries({
                                  queryKey: ["courses", id],
                                });
                              }}
                            />

                            {/* Quiz Section */}
                            <QuizSection
                              moduleId={module.id}
                              moduleName={module.name}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </SortableModuleItem>
                );
              })
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Nenhum módulo encontrado. Use o formulário acima para criar o
                primeiro módulo.
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {/* Dialogs */}
      <EditModuleDialog
        courseId={Number(id)}
        open={openEditModuleDialog}
        onOpenChange={setOpenEditModuleDialog}
        module={selectedModule}
      />

      <EditVideoDialog
        open={openEditVideoDialog}
        onOpenChange={setOpenEditVideoDialog}
        video={selectedVideo}
        moduleId={selectedModule?.id}
      />
    </div>
  );
}
