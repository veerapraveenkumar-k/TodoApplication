import styled from 'styled-components'

export const Nav = styled.nav `
   background-color: ${props => props.theme === true ? '#151414': 'lightblue'};
   border-bottom: 1px solid ${props => props.theme === true ? 'gray': 'black'};
`

export const Container = styled.div `
  background-color: ${props => props.theme === true ? '#151414': 'lightblue'};
`

export const Heading = styled.h1 `
  color: ${props => props.theme === true ? '#41b3d9': 'black'};
`

export const TaskElement = styled.div `
  border: 1px solid ${props => props.theme === true ? '#41b3d9': 'black'};
  border-left: 5px solid ${props => props.theme === true ? '#41b3d9': 'black'};;
`

export const Text = styled.h1 `
  color: ${props => props.theme === true ? 'beige': 'black'};
`

export const AddBtn = styled.button `
  background-color: ${props => props.theme === true ? 'white': 'black'};
`
