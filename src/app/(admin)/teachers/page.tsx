'use client';

import { lbsTeacher } from '@/services/external-api/teacher';
import { Teacher } from '@/types/teacher';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { TeacherModal } from './components/teacher-modal';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function TeachersPage() {
  const queryClient = useQueryClient();
  const { data: teachers = [], isLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: lbsTeacher.fetchTeachers,
  });

  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const createMutation = useMutation({
    mutationFn: lbsTeacher.createTeacher,
    onSuccess: () => {
      toast.success('Professor criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
    onError: () => toast.error('Erro ao criar professor'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) => lbsTeacher.updateTeacher(id, formData),
    onSuccess: () => {
      toast.success('Professor atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
    onError: () => toast.error('Erro ao atualizar professor'),
  });

  const deleteMutation = useMutation({
    mutationFn: lbsTeacher.deleteTeacher,
    onSuccess: () => {
      toast.success('Professor removido com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
    onError: () => toast.error('Erro ao remover professor'),
  });

  // Funções para abrir/fechar modais
  const handleOpenCreate = () => {
    setSelectedTeacher(null);
    setModalOpen(true);
  };
  const handleOpenEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setSelectedTeacher(null);
    setModalOpen(false);
    setModalLoading(false);
  };

  // Submissão do modal
  const handleSubmitModal = async (formData: FormData) => {
    setModalLoading(true);
    if (selectedTeacher) {
      await updateMutation.mutateAsync({ id: selectedTeacher.id, formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    handleCloseModal();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Professores</h1>
      <Button
        onClick={handleOpenCreate}
        className="mb-4 px-6 py-2 font-semibold"
        variant="default"
      >
        Incluir Professor
      </Button>
      {isLoading ? (
        <div>Carregando...</div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="px-4 py-3 text-center font-semibold text-gray-700">ID</TableHead>
                <TableHead className="px-4 py-3 text-center font-semibold text-gray-700">Nome</TableHead>
                <TableHead className="px-4 py-3 text-center font-semibold text-gray-700">Email</TableHead>
                <TableHead className="px-4 py-3 text-center font-semibold text-gray-700">Bio</TableHead>
                <TableHead className="px-4 py-3 text-center font-semibold text-gray-700">Foto</TableHead>
                <TableHead className="px-4 py-3 text-center font-semibold text-gray-700">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher: Teacher) => (
                <TableRow key={teacher.id} className="border-b hover:bg-gray-50">
                  <TableCell className="px-4 py-3 text-center align-middle">{teacher.id}</TableCell>
                  <TableCell className="px-4 py-3 text-center align-middle">{teacher.name}</TableCell>
                  <TableCell className="px-4 py-3 text-center align-middle">{teacher.email}</TableCell>
                  <TableCell className="px-4 py-3 text-center align-middle max-w-xs truncate">{teacher.bio}</TableCell>
                  <TableCell className="px-4 py-3 text-center align-middle">
                    {teacher.avatar_url ? (
                      <Image width={12} height={12} src={teacher.avatar_url} alt={teacher.name} className="mx-auto w-12 h-12 rounded-full object-cover border border-gray-300" />
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center align-middle">
                    <Button
                      onClick={() => handleOpenEdit(teacher)}
                      className="mr-2 px-4 py-2 font-semibold"
                      variant="secondary"
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => deleteMutation.mutate(teacher.id)}
                      className="px-4 py-2 font-semibold"
                      variant="destructive"
                    >
                      Remover
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <TeacherModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitModal}
        teacher={selectedTeacher}
        loading={modalLoading}
      />
    </div>
  );
}
