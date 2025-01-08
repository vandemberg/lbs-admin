'use client';

import { useEffect, useState } from "react";
import styles from "../create/courseCreate.module.css";
import Link from "next/link";
import CourseForm from '@/components/CourseForm';
import * as courseRequests from "@/services/requests/courses";
import Course from "@/models/Course";

export default function EditCourse() {
  const [course, setCourse] = useState({} as Course);
  
  useEffect(() => {
    async function fetchCourse() {
      const id = Number(window.location.pathname.split("/").pop());
      const data = await courseRequests.getById(id);
      setCourse(data as Course);
    }
    
    fetchCourse();
  }, []);
  
  const handleSubmit = async (courseData: FormData) => {
    try {
      const  courseUpdated = await courseRequests.updateById(course.id, courseData);
      setCourse(courseUpdated as Course);
      alert("Curso atualizado com sucesso!");
    } catch {
      alert("Erro ao atualizar curso!");
    }
  };
  
  
  return (
    <div className={styles.container}>
      <Link href="/courses" className={styles.linkBack}>Voltar</Link>
      <h1 className={styles.title}>Editar curso</h1>
      <CourseForm course={course} handleSubmit={handleSubmit} />
    </div>
  );
}
