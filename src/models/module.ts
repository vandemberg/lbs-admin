import Video from "./video";

export default interface Module {
  id: number;
  title: string;
  description: string;
  videos?: Video[];
  course_id: number;
}
