import React from "react";

export default function AboutPage() {
  return (
    <>
      <h2>About</h2>

      <p>
        This application was built as a final project for the{" "}
        <strong>React — “Kiwi”</strong> cohort at{" Summer 2025 "}
        <a
          href="https://www.codethedream.org/"
          target="_blank"
          rel="noreferrer noopener"
        >
          Code the Dream
        </a>
        . The goal is to demonstrate practical knowledge of React, React Router,
        data fetching, local persistence, and clean project structure while
        using the Petfinder API.
      </p>

      <section>
        <h3>Course & Organization</h3>
        <ul>
          <li>
            Course: <strong>React — “Kiwi”</strong> (Code the Dream).
          </li>
          <li>
            Organization:{" "}
            <a
              href="https://www.codethedream.org/"
              target="_blank"
              rel="noreferrer noopener"
            >
              Code the Dream (CTD)
            </a>{" "}
            — a nonprofit offering free intensive training in software
            development.
          </li>
          <li>
            Project requirements include routing, async data, reusable
            components, local storage, and consistent styling with CSS Modules.
          </li>
        </ul>
      </section>

      <section>
        <h3>What this project demonstrates</h3>
        <ul>
          <li>Single-Page App with client-side routing (React Router).</li>
          <li>Async requests to the Petfinder API and error handling.</li>
          <li>
            Optimistic UI ideas (favorites toggle) and clean state updates.
          </li>
          <li>Reusable components (cards, pagination, navbar, modal).</li>
          <li>LocalStorage for “Recently viewed” and Favorites persistence.</li>
          <li>CSS Modules + design tokens for a consistent UI.</li>
          <li>Feature/page/shared-based folder structure.</li>
        </ul>
      </section>

      <section>
        <h3>Tech stack</h3>
        <ul>
          <li>Vite + React (functional components and hooks).</li>
          <li>react-router for routing.</li>
          <li>CSS Modules for styles.</li>
          <li>Petfinder JavaScript SDK for API access.</li>
        </ul>
      </section>

      <section>
        <h3>Environment</h3>
        <p>
          The app uses the following environment variables (see{" "}
          <code>.env.local.example</code>):
        </p>
        <ul>
          <li>
            <code>VITE_PETFINDER_KEY</code> – API key
          </li>
          <li>
            <code>VITE_PETFINDER_SECRET</code> – API secret
          </li>
        </ul>
      </section>

      <section>
        <h3>Links</h3>
        <ul>
          <li>
            Repository:{" "}
            <a
              href="https://github.com/gabogara/adoptables"
              target="_blank"
              rel="noreferrer noopener"
            >
              github.com/gabogara/adoptables
            </a>
          </li>
          <li>
            Code the Dream:{" "}
            <a
              href="https://www.codethedream.org/"
              target="_blank"
              rel="noreferrer noopener"
            >
              codethedream.org
            </a>
          </li>
          <li>
            Petfinder API Docs:{" "}
            <a
              href="https://www.petfinder.com/developers/"
              target="_blank"
              rel="noreferrer noopener"
            >
              petfinder.com/developers
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h3>Credits</h3>
        <p>
          Pet data and images are provided by the Petfinder API. This project is
          for educational purposes as part of Code the Dream’s React “Kiwi”
          course.
        </p>
      </section>
    </>
  );
}
