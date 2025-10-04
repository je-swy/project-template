# Project Template

This is a project template for EPAM learning practice.  
It includes a setup for **Sass** compilation and project structure.

---

## 🚀 Getting Started

### 1. Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) (v16+ recommended)
- npm (comes with Node.js)

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://autocode.git.epam.com/campus_javascript/capstone-project/project-template.git
cd project-template
npm install
```

#### Run Sass compiler

To start watching and compiling your SCSS files into CSS, run:

```bash
npm run sass
```

This will compile:

src/scss/main.scss → src/main.css

Sass will watch for changes until you stop it (Ctrl + C).

📂 Project Structure
project-template/
│
├── src/
│ ├── scss/ # SCSS styles
│ │ ├── abstracts/ # variables, mixins
│ │ ├── base/ # reset, fonts
│ │ ├── components/ # buttons, forms
│ │ ├── pages/ # page-specific styles
│ │ └── main.scss # main entry point
│ │
│ └── main.css # compiled CSS (generated)
│
├── package.json
└── README.md
