import React from 'react';
import Image from 'next/image';

import styles from './Header.module.css';
import logo from "@/assets/ignite-logo.svg";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <Image className={styles.logo} src={logo} alt="Logo" />
    </header>
  );
};

export default Header;
