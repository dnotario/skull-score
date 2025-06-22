Push the current main branch changes to the staging environment following the deployment workflow described in the README. This will:

1. Build the project to generate fresh game.js file
2. Switch to the staging branch
3. Merge main into staging
4. Copy the freshly built game.js from main to staging
5. Commit the updated game.js if it has changed
6. Push to origin staging (which triggers automatic deployment)
7. Switch back to main branch

The staging site will be available at: https://dnotario.github.io/skull-score-staging/