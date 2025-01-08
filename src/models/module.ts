import Video from "./Video";

export default interface Module {
  id: number;
  name: string;
  videos?: Video[];
}
