const express = require("express")
const bp = require("body-parser")
const mysql = require("mysql")
const app= express()
app.use(bp.urlencoded({ extended:false}))
app.use(bp.json())

//mySQL - connection
// we gaan een conneciton pool maken, die is sneller omdat  connecties kunnen herbruikt worden
// en zijn performanter (= cache van db connectie)
//1 maak connection
const pool = mysql.createPool({
    connectionLimit :10, //max nr of connectie die in 1 keer worden gemaakt
    host            : "localhost",
    user            : "root",
    password        : "",
    database        : "voetbal"  //specifieer db die je gebruikt
})

//start writing first request (get all teams)
app.get("/teams",(req,res)=>{
    pool.getConnection( (err,connection) =>{//om naar pool te connecteren
        if(err)
            throw err
        
        console.log("connected as id " + connection.id)
        console.log(`connected as id ${connection.id}`)

        connection.query("select * from teams",(err,rows)=>{ //je krijgt een error of rijen terug

            connection.release() //return to the conneciton pool
            if(!err)
                res.send(rows)
            else
                console.log(err)
        })
    })      
})

app.get("/teams/:id",(req,res)=>{
    pool.getConnection( (err,connection) =>{//om naar pool te connecteren
        if(err)
            throw err

        connection.query(`select * from teams where id = ${req.params.id}`,(err,rows)=>{ //je krijgt een error of rijen terug

            connection.release() //return to the conneciton pool
            if(!err)
                res.send(rows)
            else
                console.log(err)
        })
    })      
})

//delete een team met een specifiek id
app.delete("/teams/:id",(req,res)=>{
    pool.getConnection( (err,connection) =>{//om naar pool te connecteren
        if(err)
            throw err

        connection.query(`delete from teams where id = ${req.params.id}`,(err,rows)=>{ //je krijgt een error of rijen terug

            connection.release() //return to the conneciton pool
            if(!err)
                res.send(rows)
            else
                console.log(err)
        })
    })      
})

app.post("/teams",(req,res)=>{

    const newTeam = req.body;
    console.log(newTeam)
    pool.getConnection( (err,connection) =>{//om naar pool te connecteren
        if(err)
            throw err
        let str = `insert into teams(id,Name) values(${newTeam.id}, "${newTeam.name}")`
        console.log(str)
        connection.query(str,(err,rows)=>{ //je krijgt een error of rijen terug

            connection.release() //return to the conneciton pool
            if(!err)
                res.send(rows)
            else
                console.log(err)
        })
    })      
})

app.put("/teams",(req,res)=>{

    const newTeam = req.body;
    console.log(newTeam)
    pool.getConnection( (err,connection) =>{//om naar pool te connecteren
        if(err)
            throw err
        let str = `update teams set name = "${newTeam.name}" where id = ${newTeam.id} `
        console.log(str)
        connection.query(str,(err,rows)=>{ //je krijgt een error of rijen terug

            connection.release() //return to the conneciton pool
            if(!err)
                res.send(rows)
            else
                console.log(err)
        })
    })      
})


app.listen(3000,err=>{
    if(err)
        console.log(err)
    console.log("running #3000")
})