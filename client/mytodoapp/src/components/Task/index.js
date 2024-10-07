import { TaskElement, Text } from '../../StyledComponent/Styled'
import { MdOutlineDeleteForever } from "react-icons/md"
import Cookies from 'js-cookie'

import './index.css'

const Task = props => {
    const {eachTask, themeValue, key, callBackFunction} = props
    const {task, status, _id} = eachTask
    const complete = status ? 'complete-task-text': ''
    const updateStatus = async () => {
        const updateDetails = {
            taskId: _id,
            newStatus: !status
        }
        const jwtToken = Cookies.get('jwtToken')
        const response = await fetch('http://localhost:9999/updateStatus', {
            method: 'PUT',
            body: JSON.stringify(updateDetails),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`
            }
        })
        callBackFunction()
        console.log(response)
    }

    const deleteTask = async () => {
        const updateDetails = {
            taskId: _id,
        }
        const jwtToken = Cookies.get('jwtToken')
        const response = await fetch('http://localhost:9999/deleteTask', {
            method: 'DELETE',
            body: JSON.stringify(updateDetails),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`
            }
        })
        callBackFunction()
        console.log(response)
    }

    return (
        <div className='task-element'>
            <input checked={status} type='checkbox' className='check-box' onClick={updateStatus}/>
            <TaskElement theme={themeValue} className={`task ${complete}`}>
                <Text className='task-text' theme={themeValue}>{task}</Text>
                <MdOutlineDeleteForever className='delete-icon' onClick={deleteTask}/>
            </TaskElement>
        </div>
    )
}

export default Task