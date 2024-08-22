 const express = require('express')
 const path = require('path')
 const morgan = require('morgan')
 const cors = require('cors')
 const shortId = require('shortid')
 const fs = require('fs/promises')



let dbLocation = path.resolve('src','data.json')

 const app = express()
 app.use(express.json())



 //--------------------------delete ----------------

 app.delete("/:id",async(req,res)=>{
    let id = req.params.id;
    let data = await fs.readFile(dbLocation);
    let players= JSON.parse(data)
    let player = players.find((value)=>value.id===id)
    if(!player){
         
            res.status(404).json({mst:"something went wrong"})
         
    }
    else{
        let newPlayer = players.filter((value)=>value.id !==id)
        
        await fs.writeFile(dbLocation,JSON.stringify(newPlayer))
        res.status(200).json({msg:"delete successfully"})
    }

 })

 //-----------------create if not found or update ---------------

 app.put("/:id",async(req,res)=>{
    let id = req.params.id;
    let data = await fs.readFile(dbLocation);
    let players= JSON.parse(data)
    let player = players.find((value)=>value.id===id)
    if(!player){
         let newPlayer={
            ...req.body,
            id:shortId.generate()
         }
         players.push(newPlayer)
        await fs.writeFile(dbLocation,JSON.stringify(players))
        res.status(200).json(newPlayer)
    }
    else{
        player.name = req.body.name || player.name;
        player.city = req.body.city || player.city;
        await fs.writeFile(dbLocation,JSON.stringify(players))
        res.status(200).json(player)
    }

 })




//---------------------update--------------------------

 app.patch("/:id",async(req,res)=>{
    let id = req.params.id;
    let data = await fs.readFile(dbLocation);
    let players= JSON.parse(data)
    let player = players.find((value)=>value.id===id)
    if(!player){
        res.status(404).json({msg:"something went wrong"})
    }
    else{
        player.name = req.body.name || player.name;
        player.city = req.body.city || player.city;
        await fs.writeFile(dbLocation,JSON.stringify(players))
        res.status(200).json(player)
    }

 })

 //--------------------get by id -----------------------

 app.get("/:id",async(req,res)=>{
    let id = req.params.id
    let data = await fs.readFile(dbLocation);
    let players= JSON.parse(data)
    let player = players.find((value)=>value.id===id)
    if(!player){
        res.status(404).json({msg:"something went wrong"})
    }
    else{
        res.status(201).json(player)
    }

 })

 //-----------------------create------------------------

 app.get("/",async(req,res)=>{
     let data = await fs.readFile(dbLocation)
     let players = JSON.parse(data)
     if(!players){
        res.status(404).json({msg:"something went wrong"})
     }
     else{
        res.status(201).json(players)
     }
 })

 app.post('/',async(req,res)=>{
    let player={
        ...req.body,
        id:shortId.generate()
    }
    
    let data = await fs.readFile(dbLocation)
    let players = JSON.parse(data)
    players.push(player)
    await fs.writeFile(dbLocation,JSON.stringify(players))
    res.status(200).json(player)

 })



 app.listen(3000,()=>{
    console.log("app is running on port 3000")
 })