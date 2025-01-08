"use client";

import styles from "./course.module.css";
import CourseCard from "@/app/ui/CourseCard/CourseCard";
import Link from "next/link";
import { useEffect, useState } from "react";
import * as courseRequests from "@/services/requests/courses";
import Course from "@/models/Course";

export default function Courses() {
  const [courses, setCourses] = useState([] as Course[]);
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    async function fetchCourses() {
      const courses = await courseRequests.getCourses(search);
      setCourses(courses || []);
    }
    
    fetchCourses();
  }, [search]);
  
  function handleSearchInput(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value);
  }
  
  function redirectToEdit(courseId: number) {
    window.location.href = `/courses/${courseId}`;
  }
  
  function redirectToModules(courseId: number) {
    window.location.href = `/courses/${courseId}/modules`;
  }
  
  return (
    <div>
      <h1>Listagem dos cursos</h1>

      <div className={styles.filter}>
        <input placeholder="Digite aqui o nome do curso..." type="text" value={search} onChange={handleSearchInput}/>
      </div>

      <div className={styles.actions}>
        <Link href={"/courses/create"}>Criar novo curso</Link>
      </div>

      <div className={styles.courseList}>
        {courses.map((course) => (
          <CourseCard redirectToModules={redirectToModules} redirectToEdit={redirectToEdit} key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
