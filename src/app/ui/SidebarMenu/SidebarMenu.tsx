'use client';

import Link from "next/link";
import styles from "./SidebarMenu.module.css";
import { ChartBar, User, VideoCamera } from "phosphor-react";

export default function SidebarMenu() {
  return (
    <nav className={styles.menu}>
      <ul>
        <li><Link href='/dashboard'>Dashboard <ChartBar /></Link></li>
        <li><Link href='/courses'>Cursos <VideoCamera /></Link></li>
        <li><Link href='/users'>Alunos <User /> </Link></li>
      </ul>
    </nav>
  )
}
