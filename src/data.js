export const profile = {
  name: 'Fatema Akter Usha', displayName: 'Usha', title: 'Software QA Engineer', shortTitle: 'Software QA Engineer', profileImage: '', location: 'Dhaka, Bangladesh', employer: 'TechCare Inc.',
  email: 'ushaislam2022@gmail.com', linkedin: 'https://www.linkedin.com/in/ushaislam/', github: 'https://github.com/usha-islam', cv: '/Usha_SQA_Resume.pdf', cvFilename: 'Fatema_Akter_Usha_SQA_Resume.pdf',
  intro: 'I help teams deliver reliable software through thoughtful manual testing, clear defect reporting, and a focus on the user experience.',
  availability: 'Open to full-time Software QA Engineer roles',
  whatsapp: 'https://wa.me/8801946674350', whatsappNumber: '+880 1946-674350',
  contact: 'Have a full-time opportunity for a Software QA Engineer or want to discuss my work? I’d love to hear from you.',
}
export const navigation = ['Home', 'Experience', 'Projects', 'Skills', 'Certificates', 'Articles', 'Contact']
export const designContent = {
  heroHeadline: 'I help teams deliver', heroHighlight: 'reliable software.',
}
export const skillTools = {
  postman: { label: 'Postman', logo: '/tool-logos/postman.svg', icon: 'api' },
  swagger: { label: 'Swagger', logo: '/tool-logos/swagger.svg', icon: 'api' },
  playwright: { label: 'Playwright', logo: '/tool-logos/playwright.svg', icon: 'browser' },
  jmeter: { label: 'Apache JMeter', logo: '/tool-logos/jmeter.svg', wordmark: true, icon: 'performance' },
  jam: { label: 'Jam', logo: '/tool-logos/jam.svg', icon: 'bug' },
  lightshot: { label: 'Lightshot', logo: '/tool-logos/lightshot.png', icon: 'capture' },
  excel: { label: 'Microsoft 365 (Excel)', logo: '/tool-logos/microsoft365.svg', icon: 'sheet' },
  sheets: { label: 'Google Workspace (Google Sheets)', logo: '/tool-logos/workspace-mark.png', icon: 'sheet' },
  jira: { label: 'Familiar with Jira Workflows', stripLabel: 'Jira', logo: '/tool-logos/jira.svg', icon: 'process' },
  chatgpt: { label: 'ChatGPT', logo: '/tool-logos/chatgpt.svg', darkLogo: '/tool-logos/chatgpt-dark.svg' },
  claude: { label: 'Claude', logo: '/tool-logos/claude.svg', icon: 'chat' },
  codex: { label: 'Codex' },
  slack: { label: 'Slack', logo: '/tool-logos/slack.svg', icon: 'chat' },
}
export const skills = [
  { title: 'Software Testing', icon: 'inspect', listStyle: 'chips', sections: [
    { items: [['Manual', 'inspect'], ['Functional', 'browser'], ['Regression', 'cycle'], ['Smoke', 'check'], ['Sanity', 'check'], ['Exploratory', 'inspect'], ['Integration', 'api'], ['Compatibility', 'devices'], ['Black-box Testing', 'box'], ['Verification & Validation', 'check']].map(([label, icon]) => ({ label, icon })) },
  ] },
  { title: 'Test Planning & Design', icon: 'plan', listStyle: 'planning', sections: [
    { items: [['Test Plans', 'plan'], ['Test Scenarios', 'process'], ['Test Case Design & Execution', 'plan'], ['Test Prioritization', 'priority']].map(([label, icon]) => ({ label, icon })) },
  ] },
  { title: 'API, Automation & Performance', icon: 'api', sections: [
    { title: 'API Testing', items: [skillTools.postman, skillTools.swagger] },
    { title: 'UI Automation', items: [{ ...skillTools.playwright, label: 'Playwright — Basic' }] },
    { title: 'Performance Testing', items: [{ ...skillTools.jmeter, label: 'Apache JMeter — Basic' }] },
  ] },
  { title: 'Defect Reporting & Documentation', icon: 'bug', sections: [
    { items: [{ label: 'Defect Reporting & Tracking', icon: 'bug' }, skillTools.jam, skillTools.lightshot, skillTools.excel, skillTools.sheets] },
  ] },
  { title: 'QA Process & Collaboration', icon: 'process', sections: [
    { items: [{ label: 'STLC', icon: 'cycle' }, { label: 'SDLC', icon: 'process' }, { label: 'Agile/Scrum', icon: 'cycle' }, skillTools.jira, skillTools.slack] },
  ] },
  { title: 'AI-Assisted QA', icon: 'chat', description: 'For QA task support.', sections: [
    { items: [skillTools.chatgpt, skillTools.claude, skillTools.codex] },
  ] },
]
export const experience = [
  { title: 'Software QA Engineer', company: 'TechCare Inc.', date: 'February 2026–Present', description: 'Design and execute test cases to validate functionality, identify edge cases, and assess software quality. Perform smoke, sanity, regression, and integration testing, report defects clearly, and collaborate with developers to verify fixes and support reliable releases.' },
  { title: 'SQA Intern', company: 'TechCare Inc.', date: 'November 2025–February 2026', description: 'Supported software quality assurance through test case execution and functional, integration, regression, exploratory, and usability testing. Reported and tracked bugs, collaborated with developers, and verified fixes.' },
]
export const qaVisuals = {
  stlc: [
    { title: 'Requirement Analysis', detail: 'Scope & testability' },
    { title: 'Test Planning', detail: 'Approach & priorities' },
    { title: 'Test Case Development', detail: 'Scenarios & test data' },
    { title: 'Test Environment Setup', detail: 'Environment readiness' },
    { title: 'Test Execution', detail: 'Execute, report & retest' },
    { title: 'Test Closure', detail: 'Summary & lessons learned' },
  ],
  defect: ['Identify', 'Report', 'Developer Fix', 'Retest'],
  outcomes: [{ condition: 'Verified', action: 'Close' }, { condition: 'Issue persists', action: 'Reopen' }],
}
export const qaWorkflows = {
  web: ['Requirements', 'Test Design', 'Test Execution', 'Bug Reporting', 'Retest & Regression'],
  mobile: ['Review User Journeys', 'Design Tests', 'Execute Tests', 'Report Bugs', 'Verify Fixes'],
}
const professional = { category: 'Professional QA', role: 'QA Contributor' }
export const projects = [
  { ...professional, name: 'Tranzo AI', group: 'Web Applications', domain: 'Fintech · Web Application', workflow: 'stlc', description: 'Contributed to quality assurance for a fintech web application within an Agile team. Designed and executed test cases, validated functionality and integration behaviour, and reported and tracked defects. Collaborated with developers to verify fixes and perform regression checks across iterations.', tags: ['Functional Testing', 'Integration Testing', 'Regression Testing', 'Bug Reporting'] },
  { ...professional, name: 'Freight & Logistics Platform', group: 'Web Applications', domain: 'Web Application', workflow: 'defect', description: 'Supported quality assurance for a freight and logistics web application through test case design, execution, and exploratory testing. Assessed application behaviour and usability, documented defects, and collaborated with developers on retesting and regression checks during Agile iterations.', tags: ['Test Case Design', 'Exploratory Testing', 'Usability Testing', 'Retesting'] },
  { ...professional, name: 'SubTranzo', group: 'Mobile Applications', domain: 'Subscription Tracker · Mobile Application', workflow: 'mobile', description: 'Contributed to quality assurance for a subscription-tracking mobile application. Validated functionality, navigation, and usability through structured test cases and exploratory testing. Reported bugs, verified fixes with developers, and performed smoke, sanity, and regression checks across iterations.', tags: ['Functional Testing', 'Smoke & Sanity Testing', 'Regression Testing', 'Usability Testing'] },
  { name: "UI Automation with Playwright", category: "UI automation", tool: "playwright", description: "Personal SauceDemo automation practice covering login, cart actions, and checkout.", highlights: ["Playwright, TypeScript & Page Object Model","Valid, invalid & locked-out login scenarios","Test scripts, page objects & failure screenshots"], url: "https://github.com/usha-islam/Automation_with_playwright", action: 'View on GitHub' },
  { name: "API Testing with Postman", category: "API testing", tool: "postman", description: "A personal API testing assignment exploring the DMoney demo transaction flow.", highlights: ["Postman API documentation","Newman runner with HTML reporting","Linked test cases & bug report"], url: "https://github.com/usha-islam/dmoney-assignment", action: 'View on GitHub' },
  { name: "Performance Testing with JMeter", category: "Performance testing", tool: "jmeter", description: "Personal load and stress testing practice for the Booking API using Apache JMeter.", highlights: ["Authentication, booking creation & search","JMeter test plan & performance spreadsheet","Aggregate & HTML report screenshots"], url: "https://github.com/usha-islam/Performance-Testing-Assignment", action: 'View on GitHub' },
]
export const certificate = { title: 'Full Stack SQA & Test Automation', issuer: 'Road to SDET', date: 'December 2025', url: 'https://drive.google.com/file/d/1LHoS_hSmrlUucJT-Xu7CTOQ8pebU_yg_/view?usp=sharing' }
export const certificates = [
  certificate,
  { title: 'Postman API Fundamentals', issuer: 'Postman', date: 'January 12, 2026', url: 'https://drive.google.com/file/d/190l7hyCZOtee9D0BzCIct5mq1jK6c1FC/view?usp=sharing' },
  { title: 'Introduction to Selenium', issuer: 'Simplilearn SkillUp', date: 'January 9, 2026', url: 'https://drive.google.com/file/d/10axycQm50ATiCgSRtONj1FJuGZBaFpqQ/view?usp=sharing' },
]
