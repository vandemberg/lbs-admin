'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import * as courseRequests from "@/services/requests/courses";
import * as moduleRequests from "@/services/requests/modules";
import * as videosRequests from "@/services/requests/videos";
import Course from "@/models/Course";
import Module from "@/models/Module";
import { PlusCircle } from "phosphor-react";;

export default function EditCourse() {
  const [course, setCourse] = useState({} as Course);
  const [modules, setModules] = useState([] as Module[]);
  const [isAdding, setIsAdding] = useState(false);
  const [newModuleName, setNewModuleName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoDescription, setNewVideoDescription] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newVideoTimeInSeconds, setNewVideoTimeInSeconds] = useState(0);

  useEffect(() => {
    async function fetchCourse() {
      const id = Number(window.location.pathname.split("/")[2]);
      const data = await courseRequests.getById(id);
      setCourse(data as Course);
    }
    fetchCourse();
  }, []);
  
  useEffect(() => {
    async function fetchModules() {
      if(course.id === undefined) return;
      
      const data = await moduleRequests.getAll(course.id);
      setModules(data);
    }
    
    fetchModules();
  }, [course]);

  const handleAddModule = () => {
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewModuleName("");
  };

  const handleSave = async () => {
    if (newModuleName.trim() === "") return;
    const newModule = await moduleRequests.create(course.id, { name: newModuleName });
    setModules([...modules, newModule]);
    setIsAdding(false);
    setNewModuleName("");
  };

  const handleSaveVideo = async (moduleId: number | undefined) => {
    if(moduleId === undefined) return;

    if (newVideoTitle.trim() === "" || newVideoDescription.trim() === "" || newVideoUrl.trim() === "" || newVideoTimeInSeconds <= 0) return;
    const newVideo = await videosRequests.create(course.id, moduleId, { title: newVideoTitle, description: newVideoDescription, url: newVideoUrl, timeInSeconds: newVideoTimeInSeconds });
    const updatedModules = modules.map((module) => {
      if (module.id === moduleId) {
        return { ...module, videos: [...(module.videos || []), newVideo] };
      }
      return module;
    });
    setModules(updatedModules);
    setShowModal(false);
    setNewVideoTitle("");
    setNewVideoDescription("");
    setNewVideoUrl("");
    setNewVideoTimeInSeconds(0);
  };

  return (
    <div>
      <Link href="/courses" className="button">Voltar</Link>
      <p><strong>{course.title}</strong></p>
        
      <div>
        <button className="button" onClick={handleAddModule}>
          <PlusCircle /> Adicionar novo módulo
        </button>
        {isAdding && (
          <div>
            <input
              type="text"
              value={newModuleName}
              onChange={(e) => setNewModuleName(e.target.value)}
              placeholder="Nome do novo módulo"
            />
            <button className="button" onClick={handleSave}>Salvar</button>
            <button className="button" onClick={handleCancel}>Cancelar</button>
          </div>
        )}
      </div>
      
      {modules.map((module) => (
        <div key={module.id} className="module">
          <div className="module-actions">
            <h2>{module.name}</h2>
            <button className="button">Editar módulo</button>
          </div>
          <ul>
            {module?.videos?.map((video) => (
              <li key={video.id}>
                <span>{video.title}</span>
                <div>
                  <button className="button">Editar</button>
                  <button className="button">Remover</button>
                </div>
              </li>
            ))}
          </ul>
          <button className="button" onClick={() => setShowModal(true)}>Adicionar aula</button>
        </div>
      ))}
      
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <h2>Adicionar nova aula</h2>
            <input
              type="text"
              value={newVideoTitle}
              onChange={(e) => setNewVideoTitle(e.target.value)}
              placeholder="Título da nova aula"
            />
            <input
              type="text"
              value={newVideoDescription}
              onChange={(e) => setNewVideoDescription(e.target.value)}
              placeholder="Descrição da nova aula"
            />
            <input
              type="text"
              value={newVideoUrl}
              onChange={(e) => setNewVideoUrl(e.target.value)}
              placeholder="URL da nova aula"
            />
            <input
              type="number"
              value={newVideoTimeInSeconds}
              onChange={(e) => setNewVideoTimeInSeconds(Number(e.target.value))}
              placeholder="Duração da nova aula (em segundos)"
            />
            <button className="button" onClick={() => handleSaveVideo(modules.find(module => module.id)?.id)}>Salvar</button>
            <button className="button" onClick={() => setShowModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
