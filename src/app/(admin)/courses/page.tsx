"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/lib/react-query";
import * as lbsCourse from "@/services/external-api/course";
import { useQuery } from "@tanstack/react-query";
import { Eye, Pencil, Trash, Plus } from "lucide-react";
import { AddCourseModal } from "./components/add-course-modal";
import { EditCourseModal } from "./components/edit-course-modal";
import { RemoveCourseConfirmDialog } from "./components/remove-course-confirm-dialog";
import { Course, CourseStatus } from "@/types/course";
import { toast } from "sonner";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CoursePage() {
  const [createCourseModalOpen, setCreateCourseModalOpen] = useState(false);
  const [editCourseModalOpen, setEditCourseModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);

  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: () => lbsCourse.fetchCourses(),
  });

  function getStatusLabel(status: CourseStatus): string {
    const statusMap: Record<CourseStatus, string> = {
      draft: "Rascunho",
      inprogress: "Em Progresso",
      complete: "Completo",
    };
    return statusMap[status] || status;
  }

  function getStatusBadgeColor(status: CourseStatus): string {
    const colorMap: Record<CourseStatus, string> = {
      draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      inprogress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      complete: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
    return colorMap[status] || "";
  }

  async function handleStatusChange(courseId: number, newStatus: CourseStatus) {
    try {
      await lbsCourse.updateCourseStatus(courseId, newStatus);
      toast.success(`Status do curso alterado para "${getStatusLabel(newStatus)}"`);
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
    } catch (error) {
      toast.error("Erro ao alterar status do curso");
    }
  }

  function handleCreateCourse() {
    setCreateCourseModalOpen(true);
  }

  function handleEditCourse(course: Course) {
    setCurrentCourse(course);
    setEditCourseModalOpen(true);
  }

  function handleDeleteCourse(course: Course) {
    setCurrentCourse(course);
    setIsDeleteAlertOpen(true);
  }

  async function confirmDeleteCourse() {
    if (!currentCourse) return;

    try {
      await lbsCourse.deleteCourse(currentCourse.id);
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
      toast.success(`Curso "${currentCourse.title}" removido com sucesso!`);
    } catch (error) {
      console.error("Erro ao remover curso:", error);
      toast.error("Erro ao remover curso. Tente novamente.");
    } finally {
      setIsDeleteAlertOpen(false);
      setCurrentCourse(null);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Carregando cursos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Cursos</h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie todos os seus cursos e conteúdos.
          </p>
        </div>
        <Button onClick={handleCreateCourse}>
          <Plus className="h-4 w-4 mr-2" />
          Criar Novo Curso
        </Button>
      </div>

      {courses && courses.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Acessos Únicos</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.id}</TableCell>
                      <TableCell className="max-w-md">
                        <div className="break-words">{course.title}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Select
                            value={course.status}
                            onValueChange={(value) =>
                              handleStatusChange(course.id, value as CourseStatus)
                            }
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Rascunho</SelectItem>
                              <SelectItem value="inprogress">Em Progresso</SelectItem>
                              <SelectItem value="complete">Completo</SelectItem>
                            </SelectContent>
                          </Select>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(
                              course.status
                            )}`}
                          >
                            {getStatusLabel(course.status)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{course.uniqueAccess || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCourse(course)}
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/courses/${course.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              Detalhes
                            </Link>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteCourse(course)}
                          >
                            <Trash className="h-4 w-4 mr-1" />
                            Remover
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              Você ainda não possui cursos cadastrados.
            </p>
            <Button onClick={handleCreateCourse}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Curso
            </Button>
          </CardContent>
        </Card>
      )}

      <AddCourseModal
        isOpen={createCourseModalOpen}
        onClose={() => setCreateCourseModalOpen(false)}
      />

      <EditCourseModal
        isOpen={editCourseModalOpen}
        onClose={() => {
          setEditCourseModalOpen(false);
          setCurrentCourse(null);
        }}
        course={currentCourse}
      />

      <RemoveCourseConfirmDialog
        isDeleteAlertOpen={isDeleteAlertOpen}
        setIsDeleteAlertOpen={setIsDeleteAlertOpen}
        currentCourse={currentCourse}
        confirmDelete={confirmDeleteCourse}
      />
    </div>
  );
}
