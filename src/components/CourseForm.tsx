'use client'

import { FormEvent, useEffect, useState } from "react";
import styles from '@/app/(admin)/courses/create/courseCreate.module.css';
import Course from "@/models/Course";
import Image from "next/image";

interface CourseFormProps {
  course: Course;
  handleSubmit: (course: FormData) => void;
}

export default function CourseForm({ course, handleSubmit }: CourseFormProps) {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);
  const [image, setImage] = useState(course.thumbnail);
  
  const handleSubmitEvent = async (event: FormEvent) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('thumbnail', (event.target as HTMLFormElement).image.files[0]);

    handleSubmit(formData);
  }
  
  useEffect(() => {
    setTitle(course.title);
    setDescription(course.description);
    setImage(course.thumbnail);
  }, [course]);
  
  
  return (
    <form className={styles.form} onSubmit={handleSubmitEvent}>
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>Nome</label>
        <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          type="text" 
          id="title" 
          name="title" 
          className={styles.input} 
          required 
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>Descrição</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          id="courseDescription"
          name="description"
          className={styles.textarea}
          required
        ></textarea>
      </div>
        
      <div className={styles.formGroup}>
        {!!image && <Image src={image} alt={title} width={200} height={200} />}
        
        <label htmlFor="image" className={styles.label}>Anexar Capa do curso</label>
        <input 
          type="file" 
          id="image" 
          name="image" 
          className={styles.input} 
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setImage(URL.createObjectURL(e.target.files[0]));
            }
          }}
        />
      </div>
      
      { course.id ? (
        <button type="submit" className={styles.button}>Salvar</button>
      ) : (  
        <button type="submit" className={styles.button}>Criar novo curso</button>
      )}
    </form>
  );
}
