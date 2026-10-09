import express from "express";
import morgan from "morgan";

const app = express();
app.use((req ,res,next)=>{
  const host = req.header.host;
  const sandboxId = host.split(".")[0];
  c
})


export default app;