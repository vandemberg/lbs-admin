'use client'

import styles from './layout.module.css';
import Header from '../ui/Header/Header';
import ProfileCard from '../ui/ProfileCard/ProfileCard';
import SidebarMenu from '../ui/SidebarMenu/SidebarMenu';
import { useEffect } from 'react';
import adminApi from '@/utils/http/admin-api';
import { AxiosError } from 'axios';

export default function LayoutAdmin({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  useEffect(() => {
    adminApi.interceptors.response.use(null, (error: AxiosError) => {
      if (error?.response?.status !== 401) return;

      localStorage.removeItem('jwt');
      window.location.href = '/login'
    });
  }, []);
  
  function handleLogout() {
    window.localStorage.removeItem('jwt');
    window.location.href = '/login';
  }
  
  return (
    <>
      <Header />

      <div className={styles.adminLayout}>
        <aside className={styles.adminAside}>
          <ProfileCard handleLogout={handleLogout} />

          <SidebarMenu />
        </aside>

        <main className={styles.mainContent}>{children}</main>
      </div>
    </>
  );
}

