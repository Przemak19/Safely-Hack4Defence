<div id="top">

<!-- HEADER STYLE: CLASSIC -->
<div align="center">

<img src="safely-hack4defence.png" width="35%" style="position: relative; top: 0; right: 0;" alt="Project Logo"/>

# SAFELY #HACK4DEFENCE
<em>Defend Smarter, Respond Faster, Save Lives</em>
</div>
<br>

---

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
    - [Installation](#installation)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)

---

## Overview

Safely-Hack4Defence is a comprehensive toolkit designed to emergency services. Built with modern technologies, it integrates containerized backend and frontend components, geospatial mapping, and incident management features to support emergency response and threat monitoring.

**Why Safely-Hack4Defence?**

This project enables emergency services to rapidly build, deploy, and extend a robust safety and incident response system. The core features include:

- 🐳 **Containerized Deployment:** Uses Docker and Docker Compose for seamless setup and scalable production environments.
- ⚙️ **Modular Frontend:** Built with React, Vite, and TypeScript, supporting rapid development and comprehensive testing.
- 🔒 **Secure Backend:** Implements JWT authentication, role-based access control, and a well-structured API for reliable security.
- 🌍 **Geospatial & Incident Data:** Integrates maps, strategic objects, and real-time threat data for situational awareness.
- 📁 **Extensible Architecture:** Clear separation of concerns with domain models, services, and validation schemas for maintainability.

---

## Project Structure

```sh
└── Safely-Hack4Defence/
    ├── BE
    │   ├── App.Api
    │   ├── App.Api.slnx
    │   ├── App.Application
    │   ├── App.Domain
    │   ├── App.Infrastructure
    │   └── App.Tests
    ├── Dockerfile
    ├── FE
    │   ├── .vite
    │   ├── eslint.config.js
    │   ├── index.html
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── public
    │   ├── src
    │   ├── tsconfig.app.json
    │   ├── tsconfig.json
    │   ├── tsconfig.node.json
    │   ├── vite.config.ts
    │   └── vitest.config.ts
    ├── README.md
    ├── docker-compose.yml
    ├── nginx.conf
    └── package-lock.json
```

---

## Getting Started

### Installation

Build Safely-Hack4Defence from the source and install dependencies:

1. **Clone the repository:**

    ```sh
    ❯ git clone https://github.com/Przemak19/Safely-Hack4Defence
    ```

2. **Navigate to the project directory:**

    ```sh
    ❯ cd Safely-Hack4Defence
    ```

3. **Build docker compose:**

   ```sh
   ❯ docker compose up --build
   ```
4. **Navigate to /FE:**

   ```sh
   ❯ npm install
   ```
4. **Run front:**

   ```sh
   ❯ npm run dev
   ```

## Roadmap

- [X] **`Task 1`**: <strike>Implement secured API.</strike>
- [X] **`Task 2`**: <strike>Implement rapid reports.</strike>
- [X] **`Task 3`**: <strike>Implement useful maps.</strike>

---

<div align="left"><a href="#top">⬆ Return</a></div>

---

## Application View

<h4><strong>View of application screens</strong></h4>
<img src="assets/goma_page.png" width="35%" style="position: relative; top: 0; right: 0;" alt="Project Logo"/>

