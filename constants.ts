import { TemplateType } from './types';

export const TEMPLATES = [
  {
    type: TemplateType.LANDING_PAGE,
    icon: 'Layout',
    prompt: "Create a modern, responsive product landing page with a header, hero section, features grid, pricing table, and footer. Use HTML and CSS (no frameworks). Use Placehold.co for images.",
    description: "Responsive HTML/CSS landing page."
  },
  {
    type: TemplateType.DASHBOARD,
    icon: 'BarChart',
    prompt: "Create a simple admin dashboard layout using HTML/CSS/JS. Include a sidebar, a top navbar, and a main content area with some dummy statistic cards and a table.",
    description: "Admin layout with stats."
  },
  {
    type: TemplateType.GAME,
    icon: 'Gamepad2',
    prompt: "Create a fully functional Snake game using a single HTML file with internal CSS and JavaScript. It should have a start button and score tracking.",
    description: "Classic Snake game in JS."
  },
  {
    type: TemplateType.PORTFOLIO,
    icon: 'User',
    prompt: "Create a personal developer portfolio site. Sections: About, Skills, Projects, Contact. Dark mode aesthetic. HTML/CSS/JS.",
    description: "Developer personal site."
  },
  {
    type: TemplateType.PHP_LOGIN,
    icon: 'Lock',
    prompt: "Create a simple login system with 'index.html' (login form), 'style.css', and 'login.php' (mock validation logic).",
    description: "Login form with PHP script."
  },
  {
    type: TemplateType.CALCULATOR,
    icon: 'Calculator',
    prompt: "Create a stylish, functional calculator web app using HTML, CSS, and vanilla JavaScript. Support basic arithmetic operations.",
    description: "Interactive JS Calculator."
  },
];

export const INITIAL_FILES = [
  {
    name: 'README.md',
    content: '# Welcome to CodexBuilder AI\n\nSelect a template or enter a prompt to generate a project.\n\n**Stack:** HTML, CSS, JavaScript, PHP.\n\n**Note:** PHP files are generated as text and cannot be executed in the browser preview. Download the ZIP to run them on a server.',
    language: 'markdown'
  }
];