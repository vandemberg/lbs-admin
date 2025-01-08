'use client'

import styles from './userEdit.module.css';
import Link from "next/link";
import UserForm from '@/components/UserForm';
import * as userRequests from "@/services/requests/users";
import User from '@/models/User';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function EditUser() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState({} as User);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await userRequests.getUserById(Number(id));
        setUser(userData);
      } catch {
        alert("Erro ao carregar usuário!");
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  const handleSubmit = async (userData: User) => {
    try {
      await userRequests.updateUser(Number(id), userData);
      alert("Usuário atualizado com sucesso!");
    } catch {
      alert("Erro ao atualizar usuário!");
    }
  };

  return (
    <div className={styles.container}>
      <Link href="/users" className={styles.linkBack}>Voltar</Link>
      <h1 className={styles.title}>Editar usuário</h1>
      <UserForm user={user} handleSubmit={handleSubmit} />
    </div>
  );
}
