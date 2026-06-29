import React from 'react'
import './../styling/components/Projects.css'

const works = [
  {
    tag: 'CS Capstone',
    title: 'Shipment Quoting Microservice',
    desc: 'Architected a high-throughput relational caching layer using PostgreSQL and Flask within a Dockerized microservice environment, intercepting and caching external carrier API responses to reduce redundant network calls. Achieved a 64.4% reduction in processing latency (334ms → 119ms) — a 2.8x speedup over live API calls.',
    link: 'https://github.com/haamidj/ResponsiveWebUI',
    linkLabel: 'GitHub ↗',
  },
  {
    tag: 'Barrett Honors Thesis',
    title: 'Public Perception vs. Actual Economic Effects of U.S.–China Trade Policy',
    desc: 'Investigated the divergence between the economic outcomes of the 2018–2020 U.S.–China trade war and the public\'s perception of those outcomes. Empirical evidence points to complete tariff pass-through to U.S. importers and consumers, resulting in $1.4B/month in deadweight loss. The paper examines how partisan affiliation and media framing drove public support despite these costs, and offers frameworks for better policy communication.',
    link: 'https://keep.lib.asu.edu/items/203948',
    linkLabel: 'Read Paper ↗',
  },
  {
    tag: 'Economics Capstone',
    title: 'Universal Basic Income vs. Targeted Welfare: A Macroeconomic Assessment',
    desc: 'Analyzed the macroeconomic feasibility and behavioral trade-offs of UBI versus targeted welfare systems. Drawing on empirical data and policy models from five recent global studies across developing nations (South Africa, Indonesia, Peru) and developed economies (U.S., Finland, New Zealand), the paper evaluates how funding mechanisms — consumption vs. income taxes — affect GDP growth, employment incentives, and long-term fiscal sustainability.',
    link: 'https://drive.google.com/file/d/19Bbjpar0qdztJOmNx8wKYgUJMy7kNWJi/view?usp=sharing',
    linkLabel: 'Read Paper ↗',
  },
]

function Projects() {
  return (
    <section id="projects" className="projects-section">
      <div className="section-inner projects-header-row">
        <span className="section-label">Selected Work</span>
        <span className="projects-count">{works.length} works</span>
      </div>
      <div className="projects-grid">
        {works.map((w, i) => (
          <WorkCard key={i} {...w} />
        ))}
      </div>
    </section>
  )
}

function WorkCard({ tag, title, desc, link, linkLabel }: any) {
  return (
    <div className="project-card">
      <span className="project-tag">{tag}</span>
      <h2 className="project-title">{title}</h2>
      <p className="project-desc">{desc}</p>
      <div className="project-links">
        <a href={link} target="_blank" rel="noopener noreferrer" className="project-link">
          {linkLabel}
        </a>
      </div>
    </div>
  )
}

export default Projects;
