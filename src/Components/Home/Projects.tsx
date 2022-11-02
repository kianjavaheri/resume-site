import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import Tooltip from '@mui/material/Tooltip'
import './css/Projects.css'

function Projects() {
  return (
    <div>
        <h1 className="projects-header">Projects</h1>
        <section className="projects-container">
            <ProjectCard title="Twitter Scraper" desc="Used twint API to scrape Twitter. Used pandas to clean data and used Natural Language Processing (NLP) to perform sentiment analysis on the tweet content." gitlink="https://github.com/kianjavaheri/twint-analysis"/>

            <ProjectCard title="Whiteboard" desc="Used ReactJS to create and deploy a fully functioning whiteboarding web app. A user can free draw, draw rectangles, draw lines, select lines and move them around, and undo/redo." gitlink="https://github.com/kianjavaheri/whiteboard" deplink="https://whiteboard-app-363204.uw.r.appspot.com/"/>

            <ProjectCard title="Chat App" desc="Used the ReactJS (TS) framework to create a working realtime chat app with Firebase authentication and database. " gitlink="https://github.com/kianjavaheri/chat-app"/>

            <ProjectCard title="Wordle Clone" desc="Used the pygame library to create a visualized working Wordle clone." gitlink="https://github.com/kianjavaheri/wordle-clone"/>

            <ProjectCard title="Nash Equilibrium Simulation" desc="Simulated a 'table' game to find nash equilibriums (Game Theory)." gitlink="https://github.com/kianjavaheri/nash-equilibrium"/>

            <ProjectCard title="Sudoku Solver" desc="Created a sudoku game with a solve function using backtracking." gitlink="https://github.com/kianjavaheri/sudoku-solver"/>

        </section>
    </div>
  )
}

function ProjectCard(props:any) {
  return (
    <div className="project-card">
      <h3>{props.title}</h3>
          <p>
              {props.desc}
          </p>
      {/* <FontAwesomeIcon size="3x" icon={faGithub} /> */}
      <div>
          <a href={props.gitlink} target="_blank">GitHub Project</a>
        { props.deplink && <a href={props.deplink} target="_blank">Deployed Project</a> }
      </div>
      
    </div>
  )
}

export default Projects;
