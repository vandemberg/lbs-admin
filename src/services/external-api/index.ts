import * as video from "./video";
import * as course from "./course";
import * as module from "./module";
import * as platform from "./platform";
import * as dashboard from "./dashboard";

const externalApi = {
  ...video,
  ...course,
  ...module,
  ...platform,
  ...dashboard,
};

export default externalApi;
