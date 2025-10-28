# Project Introduction: Hybrid Conversational Product Advisor Widget

**Objective**: The primary goal is to develop an embeddable React widget serving as an intelligent product advisor for e-commerce sites, specifically targeting custom window and door sales. This widget integrates both structured, deterministic filtering and natural language understanding (NLU) capabilities to assist users in product selection.

**Frontend Architecture**: The widget is architected as a stateless, client-side application built with Vite, React, TypeScript, and TailwindCSS. It operates without a backend database, embedding product catalog data, facet definitions, and knowledge base content directly within the source code. Core application flow is managed by a state-driven finite state machine within the ProductAdvisor.tsx component.

**Interaction Model**: Users can interact via two modes: selecting options presented by the deterministic filtering logic (filterLogic.ts) or typing free-text queries. User NLU input is processed by an external AI API (a separate Cloud Function) which extracts relevant product facets. These extracted facets are then fed back into the client-side state machine to refine product filtering. Note that the AI API endpoint remains consistent across different deployed versions of the widget.

**Embeddability Solution**: A key technical requirement is seamless embedding onto third-party websites without style conflicts or violating cross-origin policies. This is achieved through Shadow DOM encapsulation, implemented within main.tsx. The widget creates its own shadow root, rendering its UI and linking its CSS within this boundary, preventing interference with or from the host page. Firebase Hosting is configured with appropriate CORS headers to allow cross-origin script loading.

# Project Documentation

## 1. Project Vision and Core Function
The Hybrid Conversational Product Advisor is an advanced, embeddable React widget designed to act as an intelligent sales assistant for e-commerce platforms selling customizable products, such as windows and doors. Its core vision is to combine the best of two interaction models: deterministic logic (structured questions) and AI-driven natural language understanding (NLU). This allows users who know exactly what they want to type a direct query (like "Show me black aluminum windows"), while guiding hesitant users step-by-step through a series of filtering questions.

## 2. Architecture and Data Model
The system is built as a stateless, client-side application. Crucially, it does not require a backend database; all product catalogs, facet definitions, and knowledge base (FAQ) information are stored in static, embedded data files. The application operates as a state-driven finite state machine. This powerful, lightweight design makes the widget highly portable, allowing it to be deployed easily onto any existing e-commerce site with minimal integration effort.

## 3. Hybrid Logic and AI Integration
The system’s intelligence flows through two integrated layers. The Deterministic Filtering Engine constantly narrows the available product options based on user selections and determines the next most relevant question. If the user enters a free-text query, the AI Layer (using Google’s Gemini API) takes over. The AI's job is to interpret the natural language, extract relevant product specifications (facets), and feed those structured requirements back into the reliable deterministic engine. This hybrid approach ensures both flexibility and accuracy.

## 4. Technical Implementation and Embeddability
The entire product is built using React and TypeScript, styled with TailwindCSS, and hosted on Firebase. To solve the complex technical challenge of integrating into third-party sites, the widget uses Shadow DOM for perfect encapsulation. This prevents the widget's styles from interfering with the host website's design, and vice-versa. The backend communication (for the AI call) is handled via a secure, separate Cloud Function, which also helps solve cross-origin security issues.

## 5. Project Status and Future Goals
The project is currently at Version 5.0 and is fully functional and live. All development hurdles, including file conflicts, build errors, and complex CORS/SDK issues, have been resolved. The current challenge is refining the AI's prompt to ensure it effectively uses the injected knowledge base context for optimal accuracy. Ultimately, this project serves as a blueprint for a new class of lightweight, intelligent, and embeddable product advisors that can be deployed across any platform without requiring complex backend infrastructure.