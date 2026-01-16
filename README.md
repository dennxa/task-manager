## Setup Steps

### Prerequisites
- Node.js 16+
- Docker

First, install dependencies:
```bash
npm install
```
This project requires a `.env` file to configure the database connection. Create a `.env` file in the root of the project with the following content, replace the placeholders with your local values::

```env
DATABASE_URL="postgresql://{USER}:{PASSWORD}@localhost:5432/{DB}"
```
Make sure Docker is running, then start PostgreSQL:
```bash
docker compose up -d
```
Finally, you need to run database migrations
```bash
npx prisma migrate dev
```
Once everything has been complete, now you can run the development server:

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The database starts empty by default. You can create projects using the API:
```bash
curl -Method POST "http://localhost:3000/api/projects" `
  -ContentType "application/json" `
  -Body '{"name":"Project Test"}'
```
## Tech Choices

When starting this project, I needed to do some research because my previous experience with TypeScript was mainly focused on React, and most of the allowed tools were new to me.

After reviewing the documentation and considering the project scope, available time, and expected usage, I decided to focus on a stack that was easy to understand, easy to run, and required minimal configuration.

I chose **Next.js with TypeScript** for both the frontend and the backend. Using the same framework for the UI and the API helped simplify the project structure and made development faster. Since this project is intended to be a small internal tool, keeping everything in a single codebase felt like a practical and maintainable solution.

For the backend, I used **Next.js API routes** to build a REST API, avoiding additional frameworks and keeping the architecture simple.

For data storage, I used **PostgreSQL** running in **Docker**, which makes the local setup more consistent and easier to reproduce. **Prisma** was used as the ORM to manage the database schema, migrations, and queries in a clear way.

Overall, the chosen stack focuses on simplicity, clarity, and ease of use instead of adding unnecessary complexity.

## Tradeoffs / Known Limitations

- The backend is built using Next.js API routes instead of a separate backend framework like Express or FastAPI. This choice simplifies the setup but is less flexible for large-scale applications.

- The database starts empty by default and does not include seed data. This keeps the setup simple but requires creating data manually through the UI or API.

- Error handling and input validation are basic and focused only on the main use cases, in order to prioritize delivery speed and core functionality.

- There are no automated tests yet. While all features were tested manually during development, manual testing does not guarantee that everything will continue to work correctly. With more time, I would add unit and integration tests for the API and database logic to improve reliability.

## What I’d Improve With More Time

- Add better input validation and clearer error messages for the API.

- Add database seed data to make local testing and demos easier.

- Improve the UI with better loading states and user feedback.

- Add pagination or limits when listing tasks to better support larger datasets.

- Move the backend to a separate service (such as Express or FastAPI) if the application needed to scale beyond an internal tool.

- Add a "Create Project" form in the UI (not only via API) to make the tool easier to use for non-technical users.

- Add a search input for projects and tasks. If the dataset grows, move the search to the backend with query parameters and pagination.


