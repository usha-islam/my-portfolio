import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { profile, navigation, skills, skillTools, experience, projects, certificates, designContent, qaWorkflows, qaVisuals } from './data'
import './App.css'
import { Articles, ArticleReader } from './Articles.jsx'
import { articles } from './articles.js'

function Icon({ name, ...props }) {
  const paths = {
    arrow: <path d="M7 17 17 7M7 7h10v10" />,
    download: <path d="M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>,
    moon: <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 6 9 7 9-7" /></>,
    copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V4H4v12h4" /></>,
    whatsapp: <><path d="M20.5 11.6a8.5 8.5 0 0 1-12.7 7.3L3 20.2l1.3-4.7A8.5 8.5 0 1 1 20.5 11.6Z" /><path d="M8.4 7.4c-.3-.6-1.1-.6-1.4-.1-.5.7-.5 1.7-.2 2.5 1.1 2.8 3.3 5 6.2 6 .8.3 1.8.2 2.5-.3.5-.4.8-1 .6-1.4l-2-1c-.4-.2-.6 0-.9.4l-.5.6c-1.7-.6-3-1.9-3.7-3.5l.6-.7c.2-.3.3-.5.1-.9Z" /></>,
    location: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>,
    award: <><circle cx="12" cy="8" r="5" /><path d="m8 12-2 9 6-3 6 3-2-9" /></>,
    linkedin: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 10v7m0-10v.01M11 17v-7m0 3c0-4 6-4 6 0v4" /></>,
    github: <path d="M9 20c-4 1-4-2-6-2m12 4v-4c0-1-.3-1.7-1-2 3-.4 6-1.5 6-5a4 4 0 0 0-1-3c.3-1 .3-2-.2-3-1 0-2 .4-3 1a12 12 0 0 0-7 0c-1-.6-2-1-3-1-.5 1-.5 2-.2 3a4 4 0 0 0-1 3c0 3.5 3 4.6 6 5-.7.3-1 1-1 2v4" />,
  }
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>
}

function ExternalLink({ href, children, className = '', label }) {
  return <a href={href} className={className} aria-label={label} target="_blank" rel="noopener noreferrer">{children}<Icon name="arrow" /></a>
}

function SocialLinks({ iconsOnly = false }) {
  return <div className={iconsOnly ? 'social-links icon-socials' : 'social-links'}>
    {['linkedin', 'github'].map(network => <a key={network} href={profile[network]} target="_blank" rel="noopener noreferrer" aria-label={`Usha on ${network === 'linkedin' ? 'LinkedIn' : 'GitHub'} (opens in a new tab)`}><Icon name={network} />{!iconsOnly && <span>{network === 'linkedin' ? 'LinkedIn' : 'GitHub'}</span>}</a>)}
  </div>
}

function CVButton({ primary = false }) {
  const className = `button ${primary ? 'primary' : 'secondary'}`
  return <a className={className} href={profile.cv} download={profile.cvFilename}><Icon name="download" />Download Resume</a>
}

function SectionHeading({ number, title, description }) {
  return <div className="section-heading"><p className="section-number" aria-hidden="true">{number}</p><h2>{title}</h2>{description && <p className="section-description">{description}</p>}</div>
}

function Header({ theme, toggleTheme, activeSection }) {
  const panel = useRef(null)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const mobile = window.matchMedia('(max-width: 900px)').matches
    const frame = requestAnimationFrame(() => {
      document.querySelector(mobile ? '#mobile-navigation a' : '#more-navigation a')?.focus()
    })
    const close = event => {
      if (event.key === 'Escape') {
        setOpen(false)
        const mobile = window.matchMedia('(max-width: 900px)').matches
        document.getElementById(mobile ? 'menu-toggle' : 'more-toggle')?.focus()
      }
    }
    const outside = event => { if (!panel.current?.contains(event.target)) setOpen(false) }
    document.addEventListener('keydown', close)
    document.addEventListener('click', outside)
    return () => { cancelAnimationFrame(frame); document.removeEventListener('keydown', close); document.removeEventListener('click', outside) }
  }, [open])
  useEffect(() => {
    const breakpoint = window.matchMedia('(max-width: 900px)')
    const close = () => setOpen(false)
    breakpoint.addEventListener('change', close)
    return () => breakpoint.removeEventListener('change', close)
  }, [])
  function navigate(id) {
    setOpen(false)
    if (open) requestAnimationFrame(() => document.getElementById(id)?.focus({ preventScroll: true }))
  }
  const mainLinks = ['Home', 'Experience', 'Projects', 'Articles', 'Contact']
  const moreLinks = navigation.filter(item => !mainLinks.includes(item))
  const navLink = item => <a href={item === 'Articles' ? '#/articles' : `#${item.toLowerCase()}`} key={item} aria-current={activeSection === item.toLowerCase() ? 'location' : undefined} onClick={() => navigate(item.toLowerCase())}>{item}</a>
  return <header className="site-header" ref={panel}>
    <a className="wordmark" href="#home" aria-label="Usha, home">u<span>.</span></a>
    <nav className="desktop-nav" aria-label="Main navigation">
      {mainLinks.map(navLink)}{moreLinks.length > 0 && <><span className="nav-divider" />
      <button id="more-toggle" className="more-toggle" data-active={moreLinks.some(item => item.toLowerCase() === activeSection)} aria-expanded={open} aria-controls="more-navigation" onClick={() => setOpen(!open)}>More <span aria-hidden="true">⌄</span></button>
      <div id="more-navigation" className="more-navigation" hidden={!open}>{moreLinks.map(navLink)}</div></>}
    </nav>
    <div className="header-tools"><button className="icon-button" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} onClick={toggleTheme}><Icon name={theme === 'light' ? 'moon' : 'sun'} /></button><button id="menu-toggle" className="menu-toggle" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Close section navigation' : 'Open section navigation'} onClick={() => setOpen(!open)}><Icon name={open ? 'close' : 'menu'} /></button></div>
    <nav id="mobile-navigation" className="mobile-navigation" aria-label="Mobile navigation" hidden={!open}>{navigation.map(navLink)}</nav>
  </header>
}

function Hero() {
  return <section id="home" className="hero" tabIndex="-1"><div className="hero-content">
    <h1>{designContent.heroHeadline}<br /><span className="gradient-text">{designContent.heroHighlight}</span></h1>
    <p className="hero-introduction">Hello, I’m <span className="signature gradient-text">Fatema Akter Usha</span>, a <strong className="hero-role">Software QA Engineer</strong> with a curious mind and a keen eye for detail.</p>
    <p className="hero-description">I explore how software behaves, uncover issues that matter, and collaborate with developers to create reliable, user-friendly experiences.</p>
    <div className="hero-actions"><a className="button secondary hero-connect" href={profile.linkedin} target="_blank" rel="noopener noreferrer"><span>Let’s Connect</span><Icon name="arrow" /></a><a className="button secondary" href={profile.cv} download={profile.cvFilename}><Icon name="download" />Download Resume</a></div>
  </div></section>
}

function Experience() {
  const section = useRef(null)
  useEffect(() => {
    // Content stays visible until the observer successfully starts an entrance.
    let observer
    try {
      if (!('IntersectionObserver' in window)) return
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
      observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return
        observer.disconnect()
        if (!reducedMotion.matches) section.current?.classList.add('journey-entered')
      }, { threshold: 0, rootMargin: '0px 0px -40px 0px' })
      observer.observe(section.current)
    } catch { observer?.disconnect() /* Animation is optional; leave content visible. */ }
    return () => observer?.disconnect()
  }, [])
  return <section ref={section} id="experience" className="section container qa-journey" tabIndex="-1"><SectionHeading number="02" title="My QA Journey" /><div className="timeline">{experience.map((job, index) => <article key={job.title} className="timeline-item" style={{ '--journey-delay': `${(index + 1) * 120}ms` }}><p className="timeline-date">{job.date}</p><h3>{job.title}</h3><p className="company">{job.company}</p><p className="responsibilities">{job.description}</p></article>)}</div></section>
}

function QAWorkflow({ type }) {
  const mobile = type === 'mobile'
  return <figure className={`qa-workflow ${mobile ? 'workflow-mobile' : 'workflow-web'}`}>
    <div className="workflow-frame">
      {!mobile && <div className="workflow-browser-bar" aria-hidden="true"><span /><span /><span /><p>General QA process</p></div>}
      <div className="workflow-body">
        {mobile && <div className="workflow-phone" role="img" aria-label="Phone outline with an abstract, unchecked checklist"><div className="phone-speaker" />{[0, 1, 2, 3].map(row => <div className="phone-checklist-row" key={row}><span /><i /></div>)}<div className="phone-home" /></div>}
        <div className="workflow-process">
          <svg className="workflow-feedback" viewBox="0 0 32 300" preserveAspectRatio="none" aria-hidden="true"><path className="workflow-connector" pathLength="1" d="M28 285H12Q5 285 5 277V23Q5 15 12 15H28M22 10L28 15L22 20" /></svg>
          <ol className="workflow-stages">{qaWorkflows[type].map((stage, index) => <li key={stage} style={{ '--stage-delay': `${index * 180}ms` }}><div className="workflow-stage">{stage}</div>{index < qaWorkflows[type].length - 1 && <svg className="workflow-step-arrow" viewBox="0 0 24 20" aria-hidden="true"><path className="workflow-connector" pathLength="1" d="M12 2V16M7 11L12 16L17 11" /></svg>}</li>)}</ol>
          <p className="workflow-iteration">Next iteration</p>
        </div>
      </div>
    </div>
    <figcaption>Illustrative Agile QA workflow</figcaption>
  </figure>
}

function STLCIcon({ stage }) {
  const paths = [
    <><rect x="4" y="3" width="13" height="18" rx="2" /><path d="M7 7h7m-7 4h4" /><circle cx="16" cy="15" r="4" /><path d="m19 18 3 3" /></>,
    <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 10h18m-14 4h4m-4 3h8" /></>,
    <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8m-8 4h8m-8 4h5" /></>,
    <><rect x="3" y="3" width="18" height="7" rx="2" /><rect x="3" y="14" width="18" height="7" rx="2" /><path d="M7 6.5h.01M7 17.5h.01M12 6.5h5m-5 11h5" /></>,
    <><circle cx="12" cy="12" r="9" /><path d="m10 8 6 4-6 4z" /></>,
    <><path d="M4 5h16v16H4zM3 3h18v4H3m5 6h8m-8 4h6" /></>,
  ]
  return <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[stage]}</svg>
}

function STLCVisual() {
  const diagram = useRef(null)
  const feedback = useRef(null)
  useLayoutEffect(() => {
    const panel = diagram.current
    const cards = panel.querySelectorAll('.stlc-stage-content')
    let frame = 0
    let active = true
    function measure() {
      frame = 0
      if (!active) return
      const bounds = panel.getBoundingClientRect()
      const first = cards[0].getBoundingClientRect()
      const last = cards[cards.length - 1].getBoundingClientRect()
      const startX = last.left - bounds.left - 2
      const endX = first.left - bounds.left - 2
      const startY = last.top - bounds.top + last.height / 2
      const endY = first.top - bounds.top + first.height / 2
      const laneX = Math.max(6, Math.min(startX, endX) - 16)
      feedback.current.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`)
      feedback.current.querySelector('.stlc-feedback-line').setAttribute('d', `M${startX} ${startY}H${laneX}V${endY}H${endX}`)
      feedback.current.querySelector('.stlc-feedback-head').setAttribute('d', `M${endX - 5} ${endY - 4}L${endX} ${endY}L${endX - 5} ${endY + 4}`)
    }
    function schedule() { if (active && !frame) frame = requestAnimationFrame(measure) }
    measure()
    const observer = 'ResizeObserver' in window ? new ResizeObserver(schedule) : null
    observer?.observe(panel)
    cards.forEach(card => observer?.observe(card))
    window.addEventListener('resize', schedule)
    window.addEventListener('orientationchange', schedule)
    panel.addEventListener('animationend', schedule)
    document.fonts?.addEventListener('loadingdone', schedule)
    document.fonts?.ready.then(schedule)
    return () => {
      active = false
      cancelAnimationFrame(frame)
      observer?.disconnect()
      window.removeEventListener('resize', schedule)
      window.removeEventListener('orientationchange', schedule)
      panel.removeEventListener('animationend', schedule)
      document.fonts?.removeEventListener('loadingdone', schedule)
    }
  }, [])
  return <figure className="qa-workflow stlc-visual"><div className="workflow-frame">
    <h5 className="stlc-title">Tranzo Testing Life Cycle</h5>
    <div className="stlc-diagram" ref={diagram}>
      <svg ref={feedback} className="stlc-feedback" aria-hidden="true"><path className="workflow-connector stlc-feedback-line" /><path className="workflow-connector stlc-feedback-head" /></svg>
      <ol className="stlc-stages">{qaVisuals.stlc.map((stage, index) => <li className="stlc-stage" key={stage.title} style={{ '--stlc-delay': `${index * 180}ms` }}><div className="stlc-stage-content"><div className="stlc-icon-row"><span className="stlc-number">{index + 1}</span><STLCIcon stage={index} /></div><h6>{stage.title}</h6><p>{stage.detail}</p></div>{index < 5 && <svg className="stlc-arrow" viewBox="0 0 24 24" aria-hidden="true"><path className="workflow-connector" pathLength="1" d="M2 12H21M16 7L21 12L16 17" /></svg>}</li>)}</ol>
    </div>
    <p className="stlc-feedback-label">Feedback for the next iteration</p>
  </div><figcaption>Illustrative STLC workflow</figcaption></figure>
}

function DefectLifecycleVisual() {
  return <figure className="qa-workflow defect-visual"><div className="workflow-frame"><div className="defect-body">
    <ol className="defect-stages">{qaVisuals.defect.map((stage, index) => <li key={stage} style={{ '--stage-delay': `${index * 180}ms` }}><div className="workflow-stage">{stage}</div>{index < qaVisuals.defect.length - 1 && <svg className="workflow-step-arrow" viewBox="0 0 24 20" aria-hidden="true"><path className="workflow-connector" pathLength="1" d="M12 2V16M7 11L12 16L17 11" /></svg>}</li>)}</ol>
    <svg className="defect-fork" viewBox="0 0 200 32" preserveAspectRatio="none" aria-hidden="true"><path className="workflow-connector" pathLength="1" d="M100 1V9H50V27M45 22L50 27L55 22M100 9H150V27M145 22L150 27L155 22" /></svg>
    <svg className="defect-fork-mobile" viewBox="0 0 24 28" aria-hidden="true"><path className="workflow-connector" pathLength="1" d="M12 1V24M7 19L12 24L17 19" /></svg>
    <div className="defect-outcomes">{qaVisuals.outcomes.map(outcome => <div className="defect-outcome" key={outcome.condition} style={{ '--stage-delay': '900ms' }}><p>{outcome.condition}</p><svg className="workflow-step-arrow" viewBox="0 0 24 20" aria-hidden="true"><path className="workflow-connector" pathLength="1" d="M12 2V16M7 11L12 16L17 11" /></svg><div className="workflow-stage">{outcome.action}</div></div>)}</div>
  </div></div><figcaption>Illustrative defect lifecycle</figcaption></figure>
}

function ProfessionalProjectCard({ project }) {
  return <article className="project-row professional-project-card">
    {project.workflow === 'stlc' ? <STLCVisual /> : project.workflow === 'defect' ? <DefectLifecycleVisual /> : <QAWorkflow type={project.workflow} />}
    <div className="project-copy"><h4>{project.name}</h4><p className="project-domain">{project.domain}</p><p className="project-role">{project.role}</p><p className="project-description">{project.description}</p><ul className="tags">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></div>
  </article>
}

function ProjectRow({ project }) {
  if (project.category === 'Professional QA') return <ProfessionalProjectCard project={project} />
  const tool = skillTools[project.tool]
  return <article className="project-row personal-practice-card">
    <div className="practice-card-header"><img src={`${import.meta.env.BASE_URL}${tool.logo.replace(/^\//, '')}`} alt={tool.label} width="48" height="40" className={tool.wordmark ? 'practice-wordmark' : undefined} /><span>Personal project<span className="practice-category">{project.category}</span></span></div>
    <div className="practice-card-body"><h4>{project.name}</h4><p className="project-description">{project.description}</p><ul className="practice-highlights">{project.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul><ExternalLink href={project.url} className="practice-github-link" label={`View on GitHub: ${project.name} (opens in a new tab)`}>View on GitHub</ExternalLink></div>
  </article>
}

function Projects() {
  const section = useRef(null)
  useEffect(() => {
    let observer
    try {
      if (!('IntersectionObserver' in window)) return
      const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
      observer = new IntersectionObserver(entries => {
        const entering = entries.filter(entry => entry.isIntersecting)
          .sort((a, b) => a.target.offsetTop - b.target.offsetTop)
        entering.forEach((entry, index) => {
          observer.unobserve(entry.target)
          if (motion.matches || entry.target.classList.contains('practice-entered') || entry.target.classList.contains('workflow-entered')) return
          entry.target.style.setProperty('--practice-delay', `${index * 150}ms`)
          entry.target.classList.add(entry.target.classList.contains('personal-practice-card') ? 'practice-entered' : 'workflow-entered')
        })
      }, { rootMargin: '0px 0px -24px 0px', threshold: 0 })
      section.current.querySelectorAll('.personal-practice-card, .professional-project-card').forEach(card => observer.observe(card))
    } catch { observer?.disconnect() /* Visible content does not depend on animation setup. */ }
    return () => observer?.disconnect()
  }, [])
  return <section ref={section} id="projects" className="section container selected-work reveal" tabIndex="-1"><SectionHeading number="03" title="Projects" description="Professional QA contributions and personal testing practice." />
    {['Web Applications', 'Mobile Applications', 'Personal Practice'].map(group => <div key={group} className={`project-group${group === 'Personal Practice' ? ' practice-showcase' : ''}`}><div className="group-heading"><h3>{group}</h3>{group === 'Personal Practice' && <p>Independent learning projects</p>}</div>{projects.filter(project => group === 'Personal Practice' ? project.category !== 'Professional QA' : project.group === group).map(project => <ProjectRow project={project} key={project.name} />)}</div>)}
  </section>
}

function ToolStrip() {
  const tools = Object.entries(skillTools).filter(([key]) => key !== 'codex').map(([, tool]) => ({ ...tool, name: tool.stripLabel || tool.label }))
  // Each identical half exceeds the widest container, including its trailing gap.
  const sequence = tools
  return <div className="tool-strip">
    <div id="tool-logo-strip" className="tool-strip-viewport" tabIndex="0" role="region" aria-label="Tools used: scrolling logos. Scrolling pauses while focused.">
      <div className="tool-strip-track">
        {[0, 1].map(copy => <ul key={copy} className="tool-strip-sequence" aria-hidden={copy === 1 ? true : undefined} inert={copy === 1 ? true : undefined}>
          {sequence.map((tool, index) => <li key={`${tool.name}-${index}`} className="tool-strip-item" aria-hidden={index >= tools.length ? true : undefined}>
            <div className="tool-logo-frame"><SkillSymbol item={tool} /></div>
            <span>{tool.name}</span>
          </li>)}
        </ul>)}
      </div>
    </div>
  </div>
}

function SkillLineIcon({ name }) {
  const paths = {
    inspect: <><circle cx="10" cy="10" r="6" /><path d="m15 15 6 6M7 10h6m-3-3v6" /></>,
    browser: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M7 6.5h.01m3 0h.01m-3 7 3 3 6-6" /></>,
    cycle: <><path d="M20 7a9 9 0 0 0-15-2L2 8m0-5v5h5m-3 9a9 9 0 0 0 15 2l3-3m0 5v-5h-5" /></>,
    check: <><path d="m5 12 4 4L19 6" /><path d="M20 12v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10" /></>,
    api: <><rect x="2" y="7" width="7" height="10" rx="2" /><rect x="15" y="7" width="7" height="10" rx="2" /><path d="M9 12h6m-3-3 3 3-3 3" /></>,
    devices: <><rect x="2" y="3" width="15" height="12" rx="2" /><path d="M6 20h6m-3-5v5" /><rect x="15" y="9" width="7" height="12" rx="1" /></>,
    box: <><path d="m12 2 9 5v10l-9 5-9-5V7zm-9 5 9 5 9-5m-9 5v10" /></>,
    plan: <><rect x="4" y="4" width="16" height="18" rx="2" /><path d="M9 2h6v4H9zm-1 9h8m-8 4h8m-8 4h5" /></>,
    process: <><rect x="2" y="3" width="7" height="6" rx="1" /><rect x="15" y="15" width="7" height="6" rx="1" /><path d="M9 6h9v9m-4-4 4 4 4-4M5 9v9h10" /></>,
    priority: <><path d="M5 4v16m-3-3 3 3 3-3M12 5h9m-9 5h7m-7 5h5m-5 5h3" /></>,
    performance: <><path d="M4 19a9 9 0 1 1 16 0M12 13l5-5M4 13h2m12 0h2M12 4v2" /><circle cx="12" cy="13" r="2" /></>,
    bug: <><rect x="7" y="7" width="10" height="13" rx="5" /><path d="M9 7V4h6v3M3 9h4m10 0h4M3 14h4m10 0h4M4 20l4-3m8 0 4 3M12 8v11" /></>,
    capture: <><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" /><rect x="7" y="7" width="10" height="10" rx="2" /><circle cx="12" cy="12" r="2" /></>,
    sheet: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18m-18 6h18M9 3v18m6-18v18" /></>,
    chat: <><path d="M20 15a3 3 0 0 1-3 3H9l-5 4V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3zM8 8h8m-8 5h5" /></>,
    terminal: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m6 9 3 3-3 3m6 0h6" /></>,
  }
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.inspect}</svg>
}

function SkillSymbol({ item }) {
  const [failed, setFailed] = useState(false)
  // A text-only tool is preferable to an unverified product mark or placeholder.
  if ((!item.logo || failed) && !item.icon) return null
  return <span className={`skill-symbol${item.wordmark ? ' skill-symbol-wordmark' : ''}`} aria-hidden="true">{item.logo && !failed ? <><img className={item.darkLogo ? 'skill-logo-light' : undefined} src={`${import.meta.env.BASE_URL}${item.logo.replace(/^\//, '')}`} alt="" width="20" height="20" onError={() => setFailed(true)} />{item.darkLogo && <img className="skill-logo-dark" src={`${import.meta.env.BASE_URL}${item.darkLogo.replace(/^\//, '')}`} alt="" width="20" height="20" onError={() => setFailed(true)} />}</> : <SkillLineIcon name={item.icon} />}</span>
}

function Skills() {
  const section = useRef(null)
  useEffect(() => {
    let observer
    try {
      if (!('IntersectionObserver' in window)) return
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
      observer = new IntersectionObserver(entries => {
        entries.filter(entry => entry.isIntersecting).sort((a, b) => a.target.offsetTop - b.target.offsetTop).forEach((entry, index) => {
          observer.unobserve(entry.target)
          if (reducedMotion.matches || entry.target.classList.contains('skill-entered')) return
          entry.target.style.setProperty('--skill-delay', `${index * 120}ms`)
          entry.target.classList.add('skill-entered')
        })
      }, { rootMargin: '0px 0px -24px 0px', threshold: 0 })
      section.current.querySelectorAll('.skill-group').forEach(card => observer.observe(card))
    } catch { observer?.disconnect() /* Cards stay visible if animation setup fails. */ }
    return () => observer?.disconnect()
  }, [])
  return <section ref={section} id="skills" className="section container reveal" tabIndex="-1"><SectionHeading number="04" title="The Tools Behind the Care" /><ToolStrip /><div className="skill-groups">{skills.map(group => <article key={group.title} className="skill-group bento-card"><h3><SkillLineIcon name={group.icon} /><span>{group.title}</span></h3>{group.description && <p className="skill-context">{group.description}</p>}{group.sections.map((subsection, index) => <div className="skill-subsection" key={subsection.title || index}>{subsection.title && <h4>{subsection.title}</h4>}{subsection.description && <p className="skill-context">{subsection.description}</p>}<ul className={`skill-list${group.listStyle ? ` skill-list-${group.listStyle}` : ''}`}>{subsection.items.map(item => <li key={item.label}><SkillSymbol item={item} /><span>{item.label}</span></li>)}</ul></div>)}</article>)}</div></section>
}

function Certificates() {
  return <section id="certificates" className="section container reveal" tabIndex="-1"><SectionHeading number="05" title="Learning & Certification" /><div className="certificate-list">{certificates.map(certificate => <article key={certificate.title} className="credential-row bento-card"><Icon name="award" width="28" height="28" /><div><h3>{certificate.title}</h3><p>{certificate.issuer} · {certificate.date}</p>{certificate.description && <p>{certificate.description}</p>}{certificate.certificateId && <p>Certificate ID: {certificate.certificateId}</p>}{certificate.url && <ExternalLink href={certificate.url} className="text-link">View Certificate</ExternalLink>}</div></article>)}</div></section>
}

function Contact() {
  const [feedback, setFeedback] = useState('')
  async function copyEmail() {
    try { await navigator.clipboard.writeText(profile.email); setFeedback('Email copied to clipboard.') }
    catch { setFeedback('Copy is unavailable. Please use the Email Me button.') }
  }
  return <section id="contact" className="section container contact-section reveal" tabIndex="-1"><SectionHeading number="07" title="Contact" /><p className="contact-intro">{profile.contact}</p><div className="button-row"><a className="button primary" href={`mailto:${profile.email}`}><Icon name="mail" />Email Me</a><button className="button secondary" onClick={copyEmail}><Icon name="copy" />Copy Email</button><CVButton /><a className="button secondary" href={profile.whatsapp} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${profile.whatsappNumber} (opens in a new tab)`}><Icon name="whatsapp" />WhatsApp</a></div><p className="copy-feedback" role="status">{feedback}</p></section>
}

function App() {
  const [hash, setHash] = useState(() => window.location.hash)
  const articleSlug = hash.startsWith('#/articles/') ? hash.slice('#/articles/'.length) : null
  useEffect(() => {
    const update = () => setHash(window.location.hash)
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])
  const isArticleListing = hash === '#/articles' || hash === '#articles'
  const isArticlePage = isArticleListing || articleSlug !== null
  const previousArticle = useRef(isArticlePage)
  useEffect(() => {
    const returningFromArticle = previousArticle.current
    previousArticle.current = isArticlePage
    document.title = articleSlug ? (articles.find(article => article.slug === articleSlug)?.title || 'Article not found') + ' | Fatema Akter Usha' : isArticleListing ? 'QA Insights | Fatema Akter Usha' : 'Fatema Akter Usha | Software QA Engineer'
    const frame = requestAnimationFrame(() => {
      if (isArticlePage) {
        window.scrollTo({ top: 0, behavior: 'instant' })
        document.getElementById('main-content')?.focus({ preventScroll: true })
      } else if (hash && hash !== '#main-content') {
        const target = document.getElementById(hash.slice(1))
        target?.scrollIntoView({ behavior: returningFromArticle || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
        target?.focus({ preventScroll: true })
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [hash, articleSlug, isArticlePage, isArticleListing])
  const [year] = useState(() => new Date().getFullYear())
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light')
  const [activeSection, setActiveSection] = useState('home')
  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    try { localStorage.setItem('usha-theme', next) } catch { /* Theme works without storage. */ }
  }
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const update = () => {
      let saved
      try { saved = localStorage.getItem('usha-theme') } catch { /* Storage may be unavailable. */ }
      if (saved !== 'light' && saved !== 'dark') setTheme(query.matches ? 'dark' : 'light')
    }
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target) }
    }), { rootMargin: '0px 0px -24px 0px' })
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [isArticlePage, isArticleListing])
  useEffect(() => {
    if (isArticlePage) return
    const sections = navigation.filter(item => item !== 'Home').map(item => document.getElementById(item.toLowerCase())).filter(Boolean)
    let frame = 0
    function update() {
      frame = 0
      let current = 'home'
      if (window.scrollY > 20) {
        for (const section of sections) if (section.getBoundingClientRect().top <= Math.max(80, window.innerHeight * .2)) current = section.id
        const distance = document.documentElement.scrollHeight - window.innerHeight
        if (distance > 0 && window.scrollY >= distance - 5) current = 'contact'
      }
      setActiveSection(current)
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update) }
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const resize = 'ResizeObserver' in window ? new ResizeObserver(schedule) : null
    resize?.observe(document.body)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); resize?.disconnect() }
  }, [isArticlePage])
  return <><a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus() }}>Skip to content</a>
    <Header theme={theme} toggleTheme={toggleTheme} activeSection={isArticlePage ? 'articles' : activeSection} />
    <main id="main-content" className={isArticlePage ? undefined : 'homepage'} tabIndex="-1">
      {articleSlug !== null ? <ArticleReader slug={articleSlug} /> : isArticleListing ? <Articles /> : <><Hero /><Experience /><Projects /><Skills /><Certificates /><Contact /></>}
    </main>
    <footer className="site-footer container"><p>© {year} {profile.name}</p><SocialLinks /><a className="text-link" href="#home">Back to Top ↑</a></footer>
  </>
}
export default App
