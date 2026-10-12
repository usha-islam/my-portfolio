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
export const skills = [
  { number: '01', title: 'Testing & Quality Assurance', description: 'My focus in day-to-day professional work.', items: ['Smoke Testing', 'Sanity Testing', 'Regression Testing', 'Integration Testing', 'Functional Testing', 'Exploratory Testing', 'Usability Testing', 'Black-box Testing', 'Test Case Design and Execution', 'Defect Reporting and Retesting', 'STLC'] },
  { number: '02', title: 'Automation, API & Performance Testing', description: 'Tools for UI automation, API validation, and performance testing.', items: ['UI Automation with Playwright', 'API Testing with Postman', 'Performance Testing with JMeter'] },
  { number: '03', title: 'Collaboration', description: 'Clear documentation. Thoughtful teamwork.', items: ['Test Documentation', 'Developer Collaboration', 'Agile Workflows', 'MS Excel and Google Workspace'] },
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
  { name: 'Playwright Automation Practice', mark: '</>', category: 'Automation Practice', label: 'Personal practice · UI automation', role: 'Learning project', description: 'A personal SauceDemo UI automation project covering valid, invalid and locked-out login, cart actions, and checkout using Playwright, TypeScript and the Page Object Model. The repository includes test scripts, page objects and screenshots documenting test-failure investigation.', tags: ['Playwright', 'UI automation practice'], url: 'https://github.com/usha-islam/Automation_with_playwright', action: 'View Repository' },
  { name: 'DMoney API Testing Practice', mark: '{ }', category: 'API Practice', label: 'Personal practice · API testing', role: 'Learning assignment', description: 'A personal API testing project for the DMoney demo transaction flow, using Postman and a Newman runner configured to generate an HTML report. The repository includes the runner and README links to API documentation, test cases and a bug report.', tags: ['Postman', 'API testing practice'], url: 'https://github.com/usha-islam/dmoney-assignment', action: 'View Repository' },
  { name: 'Performance Testing Practice', mark: '↗', category: 'Performance Practice', label: 'Personal practice · Performance testing', role: 'Learning assignment', description: 'A personal JMeter project exploring load and stress testing for the Booking API, with requests for authentication, booking creation and booking search. The repository includes a JMeter test plan, a performance-testing spreadsheet and report screenshots.', tags: ['Performance testing practice'], url: 'https://github.com/usha-islam/Performance-Testing-Assignment', action: 'View Repository' },
]
export const certificate = { title: 'Full Stack SQA & Test Automation', issuer: 'Road to SDET', date: 'December 2025', url: 'https://drive.google.com/file/d/1LHoS_hSmrlUucJT-Xu7CTOQ8pebU_yg_/view?usp=sharing' }
export const certificates = [
  certificate,
  { title: 'Postman API Fundamentals', issuer: 'Postman', date: 'January 12, 2026', url: 'https://drive.google.com/file/d/190l7hyCZOtee9D0BzCIct5mq1jK6c1FC/view?usp=sharing' },
  { title: 'Introduction to Selenium', issuer: 'Simplilearn SkillUp', date: 'January 9, 2026', url: 'https://drive.google.com/file/d/10axycQm50ATiCgSRtONj1FJuGZBaFpqQ/view?usp=sharing' },
]
