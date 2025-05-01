"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { queryClient } from "@/lib/react-query";
import * as lbsCourse from "@/services/external-api/course";
import { useQuery } from "@tanstack/react-query";
import { Eye, Pencil, Trash } from "lucide-react";
import { AddCourseModal } from "./components/add-course-modal";
import { EditCourseModal } from "./components/edit-course-modal";
import { RemoveCourseConfirmDialog } from "./components/remove-course-confirm-dialog";
import { Course } from "@/types/course";
import { toast } from "sonner";
import Link from "next/link";

export default function CoursePage() {
  const [createCourseModalOpen, setCreateCourseModalOpen] = useState(false);
  const [editCourseModalOpen, setEditCourseModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);

  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: () => lbsCourse.fetchCourses(),
  });

  async function handleOnChange(checked: boolean, courseId: number) {
    if (checked) {
      await lbsCourse.enableCourse(courseId);
    } else {
      await lbsCourse.disableCourse(courseId);
    }

    queryClient.invalidateQueries({
      queryKey: ["courses"],
    });
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Listagem de cursos</h1>

      <div className="my-4 flex flex-row items-center justify-between">
        <p>Que adicionar um novo curso? </p>

        <Button onClick={handleCreateCourse} className="mt-2">
          Criar novo curso
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Título</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Acessos únicos</th>
              <th className="px-4 py-2 text-left">Ações</th>
            </tr>
          </thead>

          <tbody>
            {courses?.map((course) => (
              <tr key={course.id} className="border-t">
                <td className="px-4 py-2">{course.id}</td>
                <td className="px-4 py-2 break-all wrap-break-word">
                  {course.title}
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      onCheckedChange={async (checked) => {
                        await handleOnChange(checked, course.id);
                      }}
                      checked={course.status}
                      id={`status-${course.id}`}
                    />
                    <span className="text-sm">
                      {course.status ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </td>
                <td>{course.uniqueAccess}</td>
                <td className="px-4 py-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="mr-2 cursor-pointer"
                    onClick={() => handleEditCourse(course)}
                  >
                    Editar
                    <Pencil />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mr-2 cursor-pointer"
                    asChild
                  >
                    <Link href={`/courses/${course.id}`}>
                      Detalhes
                      <Eye />
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => handleDeleteCourse(course)}
                  >
                    Remover
                    <Trash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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
    </div>
  );
}
