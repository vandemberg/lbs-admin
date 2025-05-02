import * as video from "./video";
import * as course from "./course";
import * as module from "./module";

const externalApi = {
  ...video,
  ...course,
  ...module,
};

export default externalApi;
