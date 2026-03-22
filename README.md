# Co-Work

Co-Work is an in-progress internal collaboration platform for startup teams.

## Current slice

This repository now contains the first working foundation slice:

- a real landing page served by a Node HTTP server
- a smoke-testable health API at `/api/health`
- a blueprint API at `/api/blueprint`
- seeded product structure for workspaces, groups, modules, and roadmap phases
- automated tests for the core blueprint data and HTTP endpoints

## Scripts

- `npm start` – run the local server on port 3000
- `npm test` – run the automated test suite

## Planned next slice

1. account authentication
2. workspace and group creation
3. invitations and join flows
4. Kanban task workflow with activity history
