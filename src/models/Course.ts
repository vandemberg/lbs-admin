import Module from "./Module";

export default interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  image?: File;
  modules?: Module[];
}
