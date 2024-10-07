import React from "react"

const TasksContext = React.createContext({
    darkTheme: false,
    changeTheme: () => {}
})

export default TasksContext