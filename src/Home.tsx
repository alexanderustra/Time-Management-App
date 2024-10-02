import './App.css'
import { Productivity } from './components/Productivity'
import { Routine } from './components/Routine'
import { Timer } from './components/ClockBar'

function Home() {

  return (
    <>
      <Timer />
      <hr />
      <Routine />
      <hr />
      <Productivity />
      <hr />
    </>
  )
}

export default Home