import app from "./app.js";
import { loadAppEnv } from "./config/env.js";

const env = loadAppEnv();
const port = env.port;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`AskMyNotes backend listening on port ${port}`);
});
