const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json())
app.use(cors())

// constents

const PORT  = 9999
const connection_string = "mongodb+srv://praveen:praveen%401977@todo1.pniss.mongodb.net/MytodoDataBase?retryWrites=true&w=majority&appName=todo1"
const jwt_secret_key = "VEERA_PRAVEEN"

//DB connection Function

const DBConnection = async () => {
    try {
        await mongoose.connect(connection_string)
        console.log("DB Connected Successfully")
    } catch (error) {
        console.log("Connection Failed", error.message)
        process.exit(1)
    }
}

// Schema's

const userList = new mongoose.Schema({
    user_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const taskList = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    task: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        required: true
    },
    task_description: {
        type: String
    }
})

// Mongoose Model's

const USERS = new mongoose.model("todousers", userList, "todousers")
const TASK = new mongoose.model("userstasks", taskList, "userstasks")

//middleware Function

const AuthonticationFunction = async (req, res, next) => {
  const authHeader = await req.headers['authorization']
  try {
    if(authHeader === undefined){
        res.send("Bad Authontication")
        res.status(502)
      }
      else {
        const jwt_token = authHeader.split(' ')[1]
        const verification = jwt.verify(jwt_token, jwt_secret_key, (error, payload) => {
            if(error){
                res.send("Un Authorized")
                res.status(500)
            }
            else {
                req.user_details = payload
                next()
            }
        })
      }
  } catch (error) {
    console.log(error)
  }
}

//API'S

app.get("/", async (req, res) => {
    try {
        const users_list = await USERS.find()
        res.send(users_list)
        res.status(200)
    } catch(error){
        res.send("failed To get users_list")
        res.status(404)
    }
})

app.post("/createuser", async (req, res) => {
    try {
        const {userName, password} = await req.body
        const dbUser = await USERS.find({user_name: userName})
        if(dbUser.length === 0){
            const hashed_pass = await bcrypt.hash(password, 10)
            await USERS.insertMany([
                {
                    user_name: userName,
                    password: hashed_pass,
                }
            ])
            const response = {success: "User Created SuccessFully"}
            res.send(JSON.stringify(response))
            res.status(200)
        } else {
            const response = {error_msg: "User Already Exsits"}
            res.send(JSON.stringify(response))
            res.status(502)
        }
    } catch (error) {
        res.send("Failed To create User")
    }
})

app.post("/login", async (req, res) => {
    try {
        const {userName, password} = await req.body
        const dbUser = await USERS.find({user_name: userName})
        if(dbUser.length === 0){
            const response = {error_msg: "Invalid Username"}
            res.send(JSON.stringify(response))
        }
        else {
            const isPassCorrect = await bcrypt.compare(password, dbUser[0].password)
            if(isPassCorrect) {
                const payload = {
                    user_name: dbUser[0].user_name,
                    password: dbUser[0].password,
                    id: dbUser[0]._id
                }
                const jwt_token = jwt.sign(payload, jwt_secret_key)
                res.status(200)
                const response = {jwt_token: jwt_token}
                res.send(JSON.stringify(response))
            } else {
                const response = {error_msg: "UserName and Password doesn't match"}
                res.send(JSON.stringify(response))
                res.status(500)
            }
        }

    } catch (error){
        res.send("Failed To Login", error)
    }
})

app.post("/addTask", AuthonticationFunction, async(req, res) => {
    try {
       const {task, status, taskDescription} = await req.body
       const {id} = await req.user_details
       await TASK.insertMany({
        user_id: id,
        task: task,
        status: status,
        task_description: taskDescription,
       })
       res.send("Task Added SuccessFully")
       res.status(200)
    } catch(error){
        res.send("Failed To Add Task")
        console.log(error)
    }
})

app.get("/getAllTask", AuthonticationFunction, async (req, res) => {
    try {
        const {id} = await req.user_details
        const tasks = await TASK.find({user_id: id})
        const response = {taskList: tasks}
        res.send(JSON.stringify(response))
        res.status(200)
    } catch (error) {
        res.send("Failed To Get tasks")
    }
})

app.put("/updateStatus", AuthonticationFunction, async(req, res) => {
    try {
        const {taskId, newStatus} = await req.body
        await TASK.updateMany(
            {_id: taskId},
            {$set: {status: newStatus}}
        )
        res.send("Status Updated")
        res.status(200)
    }
    catch(error){
        res.send("Failed To Update Status")
    }
})

app.delete("/deleteTask", AuthonticationFunction, async (req, res) => {
    try {
       const {taskId} = await req.body
       await TASK.deleteMany(
        {_id: taskId},
       )
       res.send("Task SuccessFully Deleted")
       res.status(200)
    } catch(error){
        res.send("Failed To delete Task")
    }
})


// LISTEN

app.listen(PORT, () => {
    console.log("Server is Running in PORT", PORT)
    DBConnection()
})