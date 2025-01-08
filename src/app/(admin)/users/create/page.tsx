'use client'

import styles from './userCreate.module.css';
import Link from "next/link";
import UserForm from '@/components/UserForm';
import * as userRequests from "@/services/requests/users";
import User from '@/models/User';
import { useState } from 'react';

export default function CreateUser() {
  const [user] = useState({} as User);
  
  const handleSubmit = async (userData: User) => {
    try {
      await userRequests.createUser(userData);
      alert("Usuário criado com sucesso!");
    } catch {
      alert("Erro ao criar usuário!");
    } 
  }
  
  return (
    <div className={styles.container}>
      <Link href="/users" className={styles.linkBack}>Voltar</Link>
      <h1 className={styles.title}>Criar novo usuário</h1>
      <UserForm user={user} handleSubmit={handleSubmit} />
    </div>
  );
}
