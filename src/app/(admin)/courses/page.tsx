"use client";

import styles from "./course.module.css";
import CourseCard from "@/app/ui/CourseCard/CourseCard";
import adminApi from "@/utils/http/admin-api";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Course {
  id: number;
  title: string;
  description: string;
}

export default function Courses() {
  const [courses, setCourses] = useState([] as Course[]);

  useEffect(() => {
    async function fetchCourses() {
      const response = await adminApi.get("courses");
      const data = response.data;
      setCourses(data);
    }

    fetchCourses();
  }, []);

  return (
    <div>
      <h1>Listagem dos cursos</h1>

      <div className={styles.filter}>
        <input placeholder="Digite aqui o nome do curso..." type="text" />
        <button>
          Pequisar
        </button>
      </div>

      <div className={styles.actions}>
        <Link href={"/courses/create"}>Criar novo curso</Link>
      </div>

      <div className={styles.courseList}>
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
