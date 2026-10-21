import express from "express";
import morgan from "morgan";
import fs from "fs";

const WORKSPACE_DIR = "./workspace";


const app = express();
app.use(morgan());

app.get("/" ,(req ,res)=>{
  res.status(200).json({status : "ok" ,name: "agent"})
})

app.get("/list-files" ,async(req ,res)=>{
  const elememts = await fs.promises.readdir(WORKSPACE_DIR);
  res.status(200).json({
    message:"Elements in working directory",
    elements
  })
})


export default app;