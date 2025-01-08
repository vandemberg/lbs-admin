"use client";

import { useEffect, useState } from "react";
import * as userRequests from "@/services/requests/users";
import User from "@/models/User";
import styles from "./user.module.css";
import Link from "next/link";

export default function Users() {
  const [users, setUsers] = useState([] as User[]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      const users = await userRequests.getUsers(search);
      setUsers(users);
    }

    fetchUsers();
  }, [search]);

  function handleSearchInput(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value);
  }
  
  function handleRemoveUser(userId: number) {
    const result = window.confirm("Deseja realmente remover este usuário?");
    if(!result) return;
    
    userRequests.deleteById(userId);
    setUsers(users.filter((user) => user.id !== userId));
  }

  return (
    <div>
      <h1>Listagem de Usuários</h1>

      <div className={styles.filter}>
        <input placeholder="Digite aqui o nome do usuário..." type="text" value={search} onChange={handleSearchInput}/>
      </div>

      <div className={styles.actions}>
        <Link href={"/users/create"}>Criar novo usuário</Link>
      </div>

      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Tipo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Link href={`/users/${user.id}/edit`}>Editar</Link>
                <button onClick={() => handleRemoveUser(user.id)}>Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
