Push the current staging branch changes to the production environment following the deployment workflow described in the README. This will:

1. Build the project to ensure latest game.js is generated
2. Switch to the prod branch
3. Merge staging into prod
4. Copy the freshly built game.js to ensure production has latest code
5. Commit the updated game.js if it has changed
6. Push to origin prod (which triggers automatic deployment)
7. Switch back to main branch

The production site will be available at: https://www.skullkingscorekeeper.com

Note: Make sure staging has been tested before running this command.