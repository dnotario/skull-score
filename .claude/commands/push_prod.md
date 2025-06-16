Push the current staging branch changes to the production environment following the deployment workflow described in the README. This will:

1. Switch to the prod branch
2. Merge staging into prod
3. Push to origin prod (which triggers automatic deployment)
4. Switch back to main branch

The production site will be available at: https://www.skullkingscorekeeper.com

Note: Make sure staging has been tested before running this command.