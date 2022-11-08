import React from 'react'
import './css/Proficiency.css'

import python from '../../svgs/python.svg'
import java from '../../svgs/java.svg'
import js from '../../svgs/js.svg'
import react from '../../svgs/react.svg'
import go from '../../svgs/go.svg'
import cpp from '../../svgs/cpp.svg'
import gcp from '../../svgs/gcp.svg'

import Tooltip from '@mui/material/Tooltip'


function Proficiency() {
  return (
    <div>
        <h1 className="proficiency-header">Skillset</h1>
        <section className="proficiency-container">
          <div className="skill-container">
            <ProficiencyCard icon={python} lang="python" title="Python"/>
            <ProficiencyCard icon={java} lang="java" title="Java"/>
            <ProficiencyCard icon={js} lang="javascript" title="Javascript"/>
            <ProficiencyCard icon={react} lang="react" title="React"/>
            <ProficiencyCard icon={go} lang="go" title="Go"/>
            <ProficiencyCard icon={cpp} lang="cpp" title="C++"/>
            <ProficiencyCard icon={gcp} lang="gcp" title="Google Cloud"/>
          </div>
        </section>
    </div>
  )
}

function ProficiencyCard(props:any) {

  return (
      <Tooltip title={props.title}>
      <div className="skill-card">
          <img src={props.icon} className={props.lang} alt={props.lang + " logo"}></img>
          {/* <h3>{props.title}</h3> */}
      </div>
      </Tooltip>
  )
}

export default Proficiency;
