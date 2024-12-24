import Module from "./module";

export default interface Course {
  id: number;
  title: string;
  description: string;
  modules?: Module[];
}
