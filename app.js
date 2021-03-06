//requireing all the pacakages
    const express = require("express");
    const bodyParser = require("body-parser");
    const { response, query } = require("express");
    const app = new express();
    const mongoose = require('mongoose');
    const _ = require('lodash');
    var mongodb = require('mongodb');
//setting the body parser
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
//setting up the ejs , so that we can store all the templates in the view folder
    app.set("view engine","ejs");
//we are storing all the static files in public folder
    app.use(express.static("public"));
//we are creating a database using mongoose pacakage
    mongoose.connect('mongodb://localhost:27017/todolistDB');
    //creating a schema or a table blueprint [default]
    const items = mongoose.model('items',{
        name:String
    });
    //creating a schema for various type of lists
    const lists = mongoose.model('lists',{
        type:String,
        name:Array
    });
    
   
//sending data on the client side from the server, client is getting data
    app.get("/",(req,res)=>{
        items.find({},(err,result)=>{
                    res.render('list',{list_type:"General",new_added_task:result});
        })
    });
    //creating diffrent type of list
    app.get("/:topic",(req,res)=>{
        const topic = _.capitalize(req.params.topic);
        const list  = new lists({
            type:topic,
            name:new Array()
        });
        //there should be unique list for one topic, list is a record of lists table
        lists.findOne({type:topic},(err,data)=>{
            if(err){
                console.log(err);
            }else{
                if(!data){
                    //create a new list because it does not exist and save it in record
                    list.save();
                    res.redirect('/'+topic);
                }else{
                     res.render('list',{list_type:topic,new_added_task:data.name});
                }
            }
        });
       
    });

//getting data on the server posted by a form in html code
    app.post("/",(req,res)=>{
        let item = req.body.task;
        const list_ty = req.body.btn;
        const new_Item = new items({
            name:item
        });
        //saving this to database
        if(list_ty === "General"){
            new_Item.save();
            res.redirect("/");
        }else{
            lists.findOne({type:list_ty},(err,data)=>{
                data.name.push(new_Item);
                data.save();
            });
            res.redirect("/"+list_ty);
        }
    });
    app.post("/delete",(req,res)=>{
       const item_to_be_deleted=req.body.button;
       const list_type = req.body.list_name;
       if(list_type==="General"){
            items.deleteOne({_id:item_to_be_deleted},(err)=>{
                    if(err){
                        console.log(err);
                    }else{
                        console.log("successfully deleted");
                    }
            });
            res.redirect('/');
        }else{
            lists.findOneAndUpdate({type:list_type},{$pull:{ name:{_id:mongodb.ObjectId(item_to_be_deleted)}}}, function(err, data){
                data.save().then(()=>{  
                    res.redirect("/"+list_type);    
                });
              });
            
        }
    });
//listening to port 
    app.listen(process.env.PORT||3000,()=>{
        console.log("Working fine"); 
    });