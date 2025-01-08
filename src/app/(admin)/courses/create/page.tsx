'use client'

import styles from './courseCreate.module.css';
import Link from "next/link";
import CourseForm from '@/components/CourseForm';
import * as courseRequests from "@/services/requests/courses";
import Course from '@/models/Course';
import { useState } from 'react';

export default function CreateCourse() {
  const [course] = useState({} as Course);
  
  const handleSubmit = async (courseData: Course) => {
    try {
      await courseRequests.createCourse(courseData);
      alert("Curso criado com sucesso!");
    } catch {
      alert("Erro ao criar curso!");
    } 
  }
  
  return (
    <div className={styles.container}>
      <Link href="/courses" className={styles.linkBack}>Voltar</Link>
      <h1 className={styles.title}>Criar novo curso</h1>
      <CourseForm course={course} handleSubmit={handleSubmit}  />
    </div>
  );
}
