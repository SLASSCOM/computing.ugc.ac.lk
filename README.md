# UGC Computing Programs Directory

A web directory of UGC-approved undergraduate and postgraduate computing degree programs offered by state universities and higher education institutes in Sri Lanka.

Published by the **Standing Committee of Computing**, University Grants Commission (UGC) of Sri Lanka.

## Overview

This application helps students, educators, and policymakers explore computing programs across Sri Lankan universities and institutes. Browse by institution, search by keyword, and filter programs by type and computing discipline.

The directory currently lists **155 programs** (96 undergraduate, 59 postgraduate) from **29 universities and institutes**.

## Features

- **Home page** — overview statistics and a browsable grid of universities and institutes
- **Programs page** — searchable, filterable listing of all computing programs
- **Multi-select filters** — combine universities, program types (UG/PG), and disciplines
- **Program details** — modal view with faculty, department, discipline, duration, SLQF level, UGC approval, and related metadata
- **Deep linking** — selecting a university from the home page opens `/programs?university=...` pre-filtered to that institution

## Computing Disciplines

Programs are classified using the seven core computing disciplines defined by the [IEEE / ACM Computing Curricula](https://www.acm.org/education/curricula-recommendations), plus an **Other** category for programs that do not map cleanly to a single discipline:

| Discipline | Description |
| --- | --- |
| **Computer Science (CS)** | Theoretical foundations, algorithms, software development, AI/ML |
| **Computer Engineering (CE)** | Hardware design and the hardware–software interface |
| **Software Engineering (SE)** | Large-scale, reliable, safety-critical software systems |
| **Cybersecurity (CSEC)** | Data privacy, digital forensics, system security, risk management |
| **Data Science (DS)** | Data analysis, statistical modelling, big data platforms |
| **Information Systems (IS)** | Business needs and corporate technology infrastructure |
| **Information Technology (IT)** | User support, networking, web applications, technology lifecycle |
| **Other** | Programs outside the above categories |

## Tech Stack

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) for development and production builds
- [React Router](https://reactrouter.com/) for client-side routing
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide React](https://lucide.dev/) for icons

Program and university data is served as static JSON from `public/data/`.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
npm run preview
```

The production build is output to `dist/`.

### Lint

```bash
npm run lint
```

## Project Structure

```
public/
  data/
    programs.json       # Program records with discipline classifications
    universities.json   # University and institute metadata
  images/               # University logos and UGC branding assets

src/
  components/
    HomePage.tsx        # Landing page with stats and university grid
    ProgramsPage.tsx    # Search, filters, and program listings
    ProgramModal.tsx    # Program detail dialog
    ProgramCard.tsx     # Program list item
    MultiSelectFilter.tsx
    UniversityCard.tsx
    UniversityLogo.tsx
    StatsStrip.tsx
    Header.tsx
    Footer.tsx
  types/
    index.ts            # TypeScript interfaces for program and university data
  App.tsx               # Routes: / and /programs
  index.css             # Global styles and Tailwind layers
```

## Data

### Universities (`public/data/universities.json`)

Each entry includes the institution name, type, logo image, and establishment details.

### Programs (`public/data/programs.json`)

Each program record includes:

- University / HEI, faculty, and department
- Program name and qualification abbreviation
- **Discipline** (IEEE/ACM-aligned classification)
- Program level (`UG` or `PG`)
- Duration, SLQF level, medium of instruction
- UGC approval status and related metadata

## License

Copyright © 2026 University Grants Commission – Sri Lanka. All Rights Reserved.
