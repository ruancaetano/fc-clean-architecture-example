import dotenv from "dotenv";

dotenv.config();

import { app } from "./express";

const port: number = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Listen port: ${port}`);
});
