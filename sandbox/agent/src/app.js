import express from "express";
import morgan from "morgan";
import fs from "fs";

const WORKSPACE_DIR = "./workspace";


const app = express();
app.use(morgan());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/" ,(req ,res)=>{
  res.status(200).json({status : "ok" ,name: "agent"})
})

app.get("/list-files" ,async(req ,res)=>{
  const listFiles = async (dir,baseDir)=>{
    const entries = await fs.promises.readdir(dir , {withFileTypes:true});
    const files = entries.map(async(entry)=>{
      const fullPath = path.join(dir , entry.name);
      if(entry.isDirectory()){
        return await listFiles(fullPath , baseDir);
      }else{
        return path.relative(baseDir , fullPath);
      }
    })
    return Promise.all(files).then((flatten))
  }


  try{
    const files = await listFiles(WORKSPACE_DIR , WORKSPACE_DIR);
    return res.status(200).json({
      files,
    })
  }catch(error){
    return res.status(500).json({
      message:"Error listing files",
      error,
    })
  }
})


app.get("read-files" , async(req ,res)=>{
  const files = req.query.file
  if(!files){
    return res.status(400).json({message: "file is required"})
  }

  const fileList = files.split(".");
  const fileContent = {};

  await Promise.all(fileList.map(async(file)=>{
    try{
      const filePath = path.join(WORKSPACE_DIR ,file);
      const content = await fs.promises.readFile(filePath,"utf-8");
      return {
        [filePath.replace(path.join(WORKSPACE_DIR , "" ))] : content,
      }
    }catch(error){
      return {
        [filePath.replace(path.join(WORKSPACE_DIR , "" ))] : "Error reading file",
      }
    }
  }))
})


app.patch("update-files" ,async(req ,res)=>{
  const updates = req.body.updates;
  if(!updates || !Array.isArray(updates)){
    return res.status(400).json({
      message:"updates should be an array",
    })
  }
  const result = await Promise.all(updates.map(async(update)=>{
    try{
      const filePath = path.join(WORKSPACE_DIR ,update.file);

      await fs.promises.writeFile(filePath ,update.content);
      return {
        [filePath] : "success",
      }
    }catch(error){
      return {
        [filePath] : "Error writing file",
      }
    }
  }))


  app.post("/create-file" ,async(req ,res)=>{
    try{
      const filePath = path.join(WORKSPACE_DIR ,req.body.file);
      await fs.promises.writeFile(filePath ,req.body.content);
      return res.status(200).json({
        message:"File created successfully",
        filePath,
      })
    }catch(error){
      return res.status(500).json({
        message:"Error creating file",
        error,
      })
    }
  })


})


export default app;