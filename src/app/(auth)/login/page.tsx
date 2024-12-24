'use client';

import React, { useState } from "react";
import { redirect } from 'next/navigation'
import styles from "./login.module.css";
import { login as loginRequest } from "@/services/requests/login";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      const response = await loginRequest(email, password)

      if (response.ok) {
        const data = await response.json();
        const jwt = data.token;

        localStorage.setItem("jwt", jwt);
        redirect('/dashboard')
      } else {
        setError("Email ou senha incorretos.");
      }
    } catch (error) {
      console.log(error);
      setError("Ocorreu um erro. Tente novamente.");
    }
  };

  return (
    <div>
      <h1 className={styles.title}>LBS Admin</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className={styles.input}
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <label className={styles.label} htmlFor="password">
          Senha
        </label>
        
        <input
          type="password"
          id="password"
          name="password"
          className={styles.input}
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button}>
          Entrar
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
