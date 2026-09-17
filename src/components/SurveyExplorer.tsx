import React, { useMemo, useState } from 'react'
import {
  surveyQuestions,
  surveySlices,
  surveyDimensions,
  type SurveyQuestion,
} from '../content/survey'

function labelFor(q: SurveyQuestion, sliceId: string) {
  return q.sliceLabels?.[sliceId] ?? surveySlices.find((s) => s.id === sliceId)?.label ?? sliceId
}

/**
 * The thesis's survey results as one chart you steer, instead of a run of
 * chart images you page through.
 *
 * The thesis prints twenty-three charts back to back — a subset of ten
 * questions across seven subgroups, chosen to make its argument. That was
 * first rendered here as a carousel, which fixed the page's height (about
 * 10,000px of stacked pictures) but not its usability: finding "how did the
 * Econ No group answer question 14" still meant clicking through the run and
 * hoping the thesis had published that particular slice. Most of the grid it
 * never did.
 *
 * So the images are gone and the numbers are drawn instead. Two pickers reach
 * any of the forty views in two clicks, and every subgroup is there, not just
 * the published ones.
 *
 * Three decisions worth keeping:
 *
 * - **Both controls sit above the chart.** Changing a question or a dimension
 *   changes how tall the chart is — four options against six, one series
 *   against two. Above the chart, nothing the reader is aiming at moves when
 *   they click, so no part of this needs the fixed heights the carousel did.
 * - **The dimension is the unit of choice, not the subgroup.** The thesis's
 *   point is always a contrast, so picking "Economics coursework" puts Econ Yes
 *   and Econ No on the same rows rather than making you flip between them. It
 *   also caps the chart at two series, which is exactly how many validated
 *   categorical slots the site has.
 * - **Horizontal bars on a fixed 0-100% track.** The option labels are long
 *   sentences ("Balanced Trade (Imports and exports are even)"), which vertical
 *   bars can only take at an angle. The track is the whole sample, so a 2.4%
 *   answer reads as the sliver it is and questions stay comparable to each
 *   other — a bar scaled to its own row's maximum would make every question
 *   look the same shape.
 */
function SurveyExplorer({ heading }: { heading: string }) {
  const [qId, setQId] = useState(surveyQuestions[0].id)
  const [dimId, setDimId] = useState(surveyDimensions[0].id)

  const q = surveyQuestions.find((x) => x.id === qId) ?? surveyQuestions[0]
  const dim = surveyDimensions.find((d) => d.id === dimId) ?? surveyDimensions[0]

  const series = useMemo(
    () =>
      dim.slices.map((id, i) => {
        const counts = q.counts?.[id]
        return {
          id,
          label: labelFor(q, id),
          slot: (i + 1) as 1 | 2,
          pct: q.pct[id],
          counts,
          n: counts?.reduce((a, b) => a + b, 0),
        }
      }),
    [q, dim]
  )

  return (
    <div className="paper-survey" role="group" aria-label={heading}>
      <div className="paper-survey-controls">
        <p className="paper-survey-control-label" id="survey-q-label">Question</p>
        <div className="paper-survey-chips" role="group" aria-labelledby="survey-q-label">
          {surveyQuestions.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`paper-survey-chip${item.id === q.id ? ' paper-survey-chip-on' : ''}`}
              onClick={() => setQId(item.id)}
              aria-pressed={item.id === q.id}
            >
              <span className="paper-survey-chip-num">Q{item.number}</span>
              {item.short}
            </button>
          ))}
        </div>

        <p className="paper-survey-control-label" id="survey-dim-label">Break down by</p>
        <div className="paper-survey-chips" role="group" aria-labelledby="survey-dim-label">
          {surveyDimensions.map((d) => (
            <button
              key={d.id}
              type="button"
              className={`paper-survey-chip${d.id === dim.id ? ' paper-survey-chip-on' : ''}`}
              onClick={() => setDimId(d.id)}
              aria-pressed={d.id === dim.id}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Polite, not assertive: changing a filter shouldn't interrupt. */}
      <div className="paper-survey-prompt-block" aria-live="polite">
        <p className="paper-survey-heading">{q.heading}</p>
        <p className="paper-survey-prompt">{q.prompt}</p>
      </div>

      <div className="paper-survey-legend">
        {series.map((s) => (
          <span key={s.id} className="paper-survey-legend-item">
            <span className={`paper-survey-key paper-survey-s${s.slot}`} aria-hidden="true" />
            {s.label}
            {s.n != null ? <span className="paper-survey-n">n = {s.n}</span> : null}
          </span>
        ))}
      </div>

      <div className="paper-survey-rows">
        {q.options.map((option, i) => (
          <div key={option} className="paper-survey-row">
            <p className="paper-survey-option">{option}</p>
            <div className="paper-survey-bars">
              {series.map((s) => (
                <div key={s.id} className="paper-survey-bar">
                  {/* The groove is the whole sample; the fill is this answer's
                      share of it. Decorative — the value beside it is the
                      real content, so a screen reader reads the number, not
                      an unlabelled meter. */}
                  <span className="paper-survey-track" aria-hidden="true">
                    <span
                      className={`paper-survey-fill paper-survey-s${s.slot}`}
                      style={{ width: `${s.pct[i]}%` }}
                    />
                  </span>
                  <span className="paper-survey-value">
                    <span className="paper-survey-pct">{s.pct[i].toFixed(1)}%</span>
                    {s.counts ? <span className="paper-survey-count">{s.counts[i]}</span> : null}
                    {/* Names the series for anyone reading the row out of
                        context, where colour alone says nothing. */}
                    <span className="paper-survey-sr">{` ${s.label}`}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="paper-survey-note">
        {q.note
          ? q.note
          : 'Bars are the share of that subgroup choosing each answer; the figure beside each bar is the response count.'}
      </p>
    </div>
  )
}

export default SurveyExplorer
