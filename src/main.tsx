import React, {createContext, useState, useEffect } from "react";
import { TimerProvider } from "./TimeOut/TimerContext.tsx";
import ReactDOM from 'react-dom/client'
import { Routine } from './components/Routine.tsx'
import { ClockBar } from './components/ClockBar.tsx'
import {Notes} from './Notes.tsx'
import ToDo from './ToDo.tsx'

import './App.css'
import { DaySummary } from './daySumary/DaySummary.tsx'
import { TimeOut } from './TimeOut/TimeOut.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClockBar />
    <br />
    <TimerProvider>
      <TimeOut />
    </TimerProvider>
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
