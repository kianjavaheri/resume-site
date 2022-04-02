import React from 'react'

function Projects() {
  return (
    <div>
        <h1 className="projects-header">Projects</h1>
        <section className="projects-container">
            <div className="project-card">
              <h3>Twitter Scraper</h3>
              <p>
                  Used twint api to scrape twitter. Used pandas to clean data and used Natural Language Processing (NLP) to perform sentiment analysis on the tweet content.
              </p>
            </div>
        </section>
    </div>
  )
}

export default Projects;
