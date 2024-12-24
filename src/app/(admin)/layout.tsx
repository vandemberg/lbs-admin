import styles from './layout.module.css';
import Header from '../ui/Header/Header';
import ProfileCard from '../ui/ProfileCard/ProfileCard';
import SidebarMenu from '../ui/SidebarMenu/SidebarMenu';

export default function LayoutAdmin({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />

      <div className={styles.adminLayout}>
        <aside className={styles.adminAside}>
          <ProfileCard />

          <SidebarMenu />
        </aside>

        <main className={styles.mainContent}>{children}</main>
      </div>
    </>
  );
}

