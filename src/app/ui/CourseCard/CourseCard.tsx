import Course from "@/models/Course";
import styles from "./CourseCard.module.css";
import Image from "next/image";

const defaultUrl = "https://images.unsplash.com/photo-1664574654700-75f1c1fad74e?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

interface CourseCardProps {
  course: Course;
  redirectToEdit: (courseId: number) => void;
  redirectToModules: (courseId: number) => void;
}

function selectUrl(url: string) {
  if(url.includes('thumbnails')) {
    return url;
  }
  
  return defaultUrl;
}

export default function CourseCard({ course, redirectToEdit, redirectToModules }: CourseCardProps) {
  return (
    <div className={styles.courseCard}>
      <Image src={selectUrl(course.thumbnail)} alt={course.title} width={200} height={200} />

      <div className={styles.courseInfo}>
        <p>{course.title}</p>
        <span>{course.description}</span>
      </div>

      <div className={styles.courseReports}>
        <ul>
          <li>Quantidade de módulos: 10</li>
          <li>Quantidade de alunos: 10</li>
          <li>Status atual</li>
        </ul>
      </div>

      <div className={styles.courseActions}>
        <button onClick={() => redirectToEdit(course.id)}>Editar</button>
        <button onClick={() => redirectToModules(course.id)} className={styles.videos}>Módulos e Vídeos</button>
        <button className={styles.delete}> Desabilitar</button>
      </div>
    </div>
  )
}
