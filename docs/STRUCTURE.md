<!-- docs/STRUCTURE.md -->

# Project Structure

This project follows a modular, feature-based architecture to manage Telegram bot features cleanly using Telegraf scenes. Each feature is completely self-contained within the `src/features/<group>/<feature_name>/` directory.

## Component Responsibilities

1. **Scene (`<feature>.scene.ts`)**
   - Defines the Telegraf scene (`Scenes.BaseScene`).
   - Acts as the router, mapping Telegram events (`Scene.enter`, `Scene.action`, `Scene.on`) to the appropriate controller functions.

2. **Controllers (`controllers/<feature>.controller.ts`)**
   - Orchestrates the execution flow for specific user actions.
   - Handles the incoming `ctx` (Context).
   - Calls the `Service` layer to process business logic.
   - Calls the `View` layer to update the UI or send messages based on the service's result.

3. **Services (`services/<feature>.service.ts`)**
   - Contains all the core business logic.
   - Calls the `Repository` layer to fetch or modify data.
   - Returns structured data to the controllers.
   - **Strict Rule:** Does NOT interact directly with Telegraf's `ctx`.

4. **Repositories (`repositories/<feature>.repository.ts`)**
   - The Data Access Layer.
   - Handles direct interaction with databases, external APIs, or mock data.

5. **Views (`views/`)**
   - **`<feature>.view.ts`**: Contains functions that interact with the Telegraf context to send or edit messages (e.g., `ctx.reply`, `ctx.editMessageText`).
   - **`<feature>.keyboards.ts`**: Responsible for building Telegram UI components like inline and reply keyboards.
   - **`<feature>.messages.ts`**: Contains pure string constants and localized text. Keeps literal text out of the logic layers.

6. **Types (`types/<feature>.types.ts`)**
   - Contains feature-specific TypeScript interfaces (e.g., Domain models, Context extensions).
