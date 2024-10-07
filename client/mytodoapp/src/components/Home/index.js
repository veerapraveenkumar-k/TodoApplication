import { Component } from "react"
import TasksContext from "../../Context/TasksContext"
import { Nav, Container, Heading, TaskElement, AddBtn} from "../../StyledComponent/Styled"
import { FaMoon } from "react-icons/fa";
import { IoSunnyOutline } from "react-icons/io5";
import Task from "../Task"
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import { IoIosLogOut } from "react-icons/io";

import './index.css'

const myTask = [
    {   
        id: 1,
        task: "Learn HTML",
        status: false,
    },
    {   
        id: 2,
        task: "Learn CSS",
        status: true
    }
]

class Home extends Component {
    state = {
        darkTheme: false,
        header: false,
        allTask: myTask,
        task: '',
    }

    getAllTask = async () => {
        const jwtToken = Cookies.get('jwtToken')
        console.log(jwtToken)
        try {
            const response = await fetch('http://localhost:9999/getAllTask', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${jwtToken}`
                }
            })
            const responseData = await response.json()
            console.log(responseData)
            this.setState({allTask: responseData.taskList})
        } catch(error) {
            console.log(error)
        }
    }



    componentDidMount() {
        this.getAllTask()
    }

    changeTheme = () => {
        this.setState(preState => ({
            darkTheme: !preState.darkTheme,
            header: !preState.header
        }))
    }
    
    renderThemeIcon = () => {
        const {darkTheme} = this.state
        return (
            <div className="icon-container" onClick={this.changeTheme}>
            {darkTheme? <IoSunnyOutline className="sun-icon"/>: <FaMoon className="moon-icon"/>}
            </div>
        )
    }


    renderNonCompleteTask = () => {
        const {header, allTask} = this.state
        const nonCompleteTask = allTask.filter(eachTask => eachTask.status=== false)
        return (
            <div className="task-function">
            <Heading theme={header} className="task-heading">My Task's</Heading>
            <div className="task-inner-conatier">
            {nonCompleteTask.map(eachTask => <Task eachTask={eachTask} key={eachTask.id} themeValue={header} callBackFunction={this.getAllTask}/>)}
            </div>
            </div>
        )
    }

    renderCompleteTask = () => {
        const {header, allTask} = this.state
        const nonCompleteTask = allTask.filter(eachTask => eachTask.status !== false)
        return (
            <div className="task-function">
            <Heading theme={header} className="task-heading">Completed Task's</Heading>
            <div className="task-inner-conatier">
            {nonCompleteTask.map(eachTask => <Task eachTask={eachTask} key={eachTask.id} themeValue={header} callBackFunction={this.getAllTask}/>)}
            </div>
            </div>
        )
    }

    updateTask = event => {
        this.setState({task: event.target.value})
    }

    addTask = async () => {
        const {task} = this.state
        const jwtToken = Cookies.get('jwtToken')
        const taskDetails = {
            task,
            status: false
        }
        const response = await fetch('http://localhost:9999/addTask', {
            method: 'POST',
            body: JSON.stringify(taskDetails),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`
            }
        })
        this.getAllTask()
        this.setState({task: ''})
    }

    renderAddTask = () => {
        const {header, task} = this.state
        const addInputText = header? 'dark-text': 'light-text'
        const btnText = header ? 'light-text': 'dark-text'
        return (
            <div>
            <Heading theme={header} className="task-heading">Add Task</Heading>
            <div className="add-task-container">
                <TaskElement theme={header} className="input-add"><input value={task} onChange={this.updateTask} className={`add-input-box ${addInputText}`} type="text" placeholder="enter task what you want complete"/></TaskElement>
                <AddBtn theme={header} className={`add-task-btn ${btnText}`} onClick={this.addTask}>Add</AddBtn>
            </div>
            </div>
        )
    }

    onLogout = () => {
        const {history} = this.props
        Cookies.remove('jwtToken')
        history.replace('/login')
    }

   render() {
    const {darkTheme, header} = this.state
    const jwtToken = Cookies.get('jwtToken')
    if(jwtToken === undefined){
        return <Redirect to="/login"/>
    }
    return (
        <TasksContext.Provider value={{
            darkTheme: darkTheme,
        }}>
           <div className="home-container">
            <Nav theme={header} className="home-header">
                <div className="logo-container">
                <Heading theme={header} className="logo">MyToDo</Heading>
                <IoIosLogOut className="delete-icon" onClick={this.onLogout}/>
                </div>
                {this.renderThemeIcon()}
            </Nav>
            <Container theme={header}className="task-container">
                <div>
                {this.renderNonCompleteTask()}
                {this.renderCompleteTask()}
                </div>
                {this.renderAddTask()}
            </Container>
           </div>
        </TasksContext.Provider>
    )
   }
}

export default Home