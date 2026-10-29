import express from "express";

const app = express();
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/" ,(req ,res)=>{
  res.status(200).json({
    status:"ok"
  })
})

export default app;