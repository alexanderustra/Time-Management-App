import React from 'react'
import ReactDOM from 'react-dom/client'
import { Routine } from './components/Routine.tsx'
import { ClockBar } from './components/ClockBar.tsx'
import {Notes} from './Notes.tsx'
import ToDo from './ToDo.tsx'

import './App.css'
import { DaySummary } from './daySumary/DaySummary.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClockBar />
    <hr />
    <Routine />
    <hr />
    <ToDo />
    <hr />
    <DaySummary />
    <br />
    <Notes />
    <br />
    <br />
  </React.StrictMode>,
)
