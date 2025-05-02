"use client";

import { useQuery } from "@tanstack/react-query";
import lbsHttp from "@/services/external-api";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { AddModuleDialog } from "@/app/(admin)/courses/[id]/components/add-module-dialog";
import { EditModuleDialog } from "@/app/(admin)/courses/[id]/components/edit-module-dialog";
import { AddVideoDialog } from "@/app/(admin)/courses/[id]/components/add-video-dialog";
import { EditVideoDialog } from "@/app/(admin)/courses/[id]/components/edit-video-dialog";
import { Module } from "@/types/module";
import { Video } from "@/types/video";
import { queryClient } from "@/lib/react-query";
import { toast } from "sonner";

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
  const [openAddModuleDialog, setOpenAddModuleDialog] = useState(false);
  const [openEditModuleDialog, setOpenEditModuleDialog] = useState(false);
  const [openAddVideoDialog, setOpenAddVideoDialog] = useState(false);
  const [openEditVideoDialog, setOpenEditVideoDialog] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const { data: course, isLoading } = useQuery({
    queryKey: ["courses", id],
    queryFn: () => lbsHttp.fetchCourseById(Number(id)),
  });

  if (Number.isNaN(Number(id))) {
    return <div>Invalid course ID</div>;
  }

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  const handleAddModule = () => {
    setOpenAddModuleDialog(true);
  };

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

  const handleAddVideo = (module: Module) => {
    setSelectedModule(module);
    setOpenAddVideoDialog(true);
  };

  const handleEditVideo = (video: Video, module: Module) => {
    setSelectedVideo(video);
    setSelectedModule(module);
    setOpenEditVideoDialog(true);
  };

  const handleToggleVideoVisibility = (module: Module, video: Video) => {
    const status = video.status === "published" ? "draft" : "published";
    lbsHttp.changeStatusVideo(Number(id), module.id, video.id, status);
    toast.success("Status do vídeo atualizado com sucesso");
    queryClient.invalidateQueries({
      queryKey: ["courses", id],
    });
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Curso: {course?.title}</h2>
        <Button onClick={handleAddModule}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Módulo
        </Button>
      </div>

      {(course?.modules ?? []).length > 0 ? (
        (course?.modules ?? []).map((module: Module) => (
          <Card key={module.id} className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">{module.name}</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditModule(module)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar Módulo
                </Button>
                <Button size="sm" onClick={() => handleAddVideo(module)}>
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Adicionar Vídeo
                </Button>

                <Button size="sm" onClick={() => handleRemoveModule(module)}>
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Remover módulo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Duração</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {module.videos?.length > 0 ? (
                    module.videos.map((video: Video) => (
                      <TableRow key={video.id}>
                        <TableCell className="wrap-break-word whitespace-normal max-w-[50%]">
                          {video.title}
                        </TableCell>
                        <TableCell>
                          {formatTime(video.time_in_seconds)}
                        </TableCell>
                        <TableCell>{video.status}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEditVideo(video, module)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center space-x-2">
                              <Switch
                                className="cursor-pointer"
                                checked={video.status === "published"}
                                onCheckedChange={() =>
                                  handleToggleVideoVisibility(module, video)
                                }
                              />
                            </div>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDeleteVideo(module, video)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        Nenhum vídeo encontrado para este módulo
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">
              Nenhum módulo encontrado para este curso
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={handleAddModule}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Primeiro Módulo
            </Button>
          </CardContent>
        </Card>
      )}

      <AddModuleDialog
        open={openAddModuleDialog}
        onOpenChange={setOpenAddModuleDialog}
        courseId={Number(id)}
      />

      <EditModuleDialog
        courseId={Number(id)}
        open={openEditModuleDialog}
        onOpenChange={setOpenEditModuleDialog}
        module={selectedModule}
      />

      <AddVideoDialog
        open={openAddVideoDialog}
        onOpenChange={setOpenAddVideoDialog}
        moduleId={selectedModule?.id}
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
