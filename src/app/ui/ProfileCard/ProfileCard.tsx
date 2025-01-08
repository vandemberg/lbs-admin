'use client';

import Image from "next/image";
import { Pencil, SignOut } from "phosphor-react";
import styles from "./ProfileCard.module.css";
import User from "@/models/User";

const user = {
  id: 1,
  name: 'Vandemberg',
  email: 'vandemberg.silva.lima@gmail.com',
  avatarUrl: 'https://github.com/vandemberg.png',
} as User;

interface ProfileCardProps {
  handleLogout: () => void;
}

export default function ProfileCard({ handleLogout }: ProfileCardProps) {
  function handleOnClick() {
    handleLogout();
  }
  
  return (
    <div className={styles.profile}>
      <Image src={user.avatarUrl} alt={user.name} width={100} height={100} />

      <div className={styles.profileInfo}>
        <strong>{user.name}</strong>

        <div className={styles.profileActions}>
          <button>
            <Pencil /> Editar
          </button>
          <button onClick={handleOnClick}>
            <SignOut /> Sair
          </button>
        </div>
      </div>
    </div>
  )
}
