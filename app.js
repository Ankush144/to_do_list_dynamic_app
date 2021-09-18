const express = require("express");
const bodyParser = require("body-parser");
const { response } = require("express");
const app = new express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set("view engine","ejs");
app.use(express.static("public"));
//creating an array to store all the items of the to_do_list
const items = [];
const days = ["Sun","Mon","Tue","Wed","Thur","Fri","Sat"];
app.get("/",(req,res)=>{
    const date = new Date();
    const day = date.getDay();
    res.render('list', {kindofday:days[day],new_added_task:items});
    //res.send("ok");
});

app.get('/it*em',(req,res)=>{
      let url = req.url;
      let length = url.length-2;
      let index = url.substring(3,length);
      items.splice(index, 1);
      res.redirect("/");
    });

app.post("/",(req,res)=>{
    const new_task = req.body.task;
    items.push(new_task);
    res.redirect("/");
});
app.listen(process.env.PORT||3000,()=>{
    console.log("Working fine"); 
});