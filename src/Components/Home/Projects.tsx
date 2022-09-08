import React from 'react'



function Projects() {
  return (
    <div>
        <h1 className="projects-header">Projects</h1>
        <section className="projects-container">
            <div className="project-card">
              <h3>Twitter Scraper</h3>
              <p>
                Used twint API to scrape Twitter. Used pandas to clean data and used Natural Language Processing (NLP) to perform sentiment analysis on the tweet content.
              </p>
              <a href="https://github.com/kianjavaheri/twint-analysis" target="_blank">
                See GitHub Project
              </a>
            </div>

            <div className="project-card">
              <h3>Chat App</h3>
              <p>
                Used the ReactJS (TS) framework to create a working realtime chat app with Firebase authentication and database. 
              </p>
              <a href="#" target="_blank">
                See GitHub Project
              </a>
            </div>

            <div className="project-card">
              <h3>Wordle Clone</h3>
              <p>
                Used the pygame library to create a visualized working Wordle clone.
              </p>
              <a href="#" target="_blank">
                See GitHub Project
              </a>
            </div>

            <div className="project-card">
              <h3>Nash Equilibrium Simulation</h3>
              <p>
                Simulated a 'table' game to find nash equilibriums (Game Theory).
              </p>
              <a href="#" target="_blank">
                See GitHub Project
              </a>
            </div>
        </section>
    </div>
  )
}

export default Projects;
