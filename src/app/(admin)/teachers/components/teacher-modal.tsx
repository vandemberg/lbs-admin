import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Teacher } from '@/types/teacher';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  teacher?: Teacher | null;
  loading?: boolean;
}

export function TeacherModal({ isOpen, onClose, onSubmit, teacher, loading }: TeacherModalProps) {
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (teacher) {
      reset({
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        bio: teacher.bio,
        avatar: undefined,
      });
      setAvatarPreview(teacher.avatar_url || null);
    } else {
      reset({ name: '', email: '', phone: '', bio: '', avatar: undefined });
      setAvatarPreview(null);
    }
  }, [teacher, reset]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('avatar', file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
      setValue('avatar', undefined);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{teacher ? 'Editar Professor' : 'Adicionar Professor'}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((values) => {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('email', values.email);
            if (values.phone) formData.append('phone', values.phone);
            if (values.bio) formData.append('bio', values.bio);
            if (values.avatar) formData.append('avatar', values.avatar);
            onSubmit(formData);
          })}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input id="name" {...register('name', { required: true })} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email', { required: true })} />
          </div>
          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" {...register('phone')} />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Input id="bio" {...register('bio')} />
          </div>
          <div>
            <Label htmlFor="avatar">Foto</Label>
            <Input id="avatar" type="file" accept="image/*" onChange={handleAvatarChange} />
            {avatarPreview && (
              <Image width={24} height={24} src={avatarPreview} alt="Preview" className="mt-2 w-24 h-24 rounded-full object-cover" />
            )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className="!bg-blue-600 !hover:bg-blue-700 !text-white !font-semibold !px-4 !py-2 !rounded !cursor-pointer !transition-colors !duration-200"
            >
              {teacher ? 'Salvar' : 'Adicionar'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="!bg-gray-200 !hover:bg-gray-300 !text-gray-800 !font-semibold !px-4 !py-2 !rounded !ml-2 !cursor-pointer !transition-colors !duration-200"
            >
              Cancelar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
