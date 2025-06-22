Push the current main branch changes to the staging environment following the deployment workflow described in the README. This will:

1. Switch to the staging branch
2. Sync to head and merge main into staging
3. Build the project to generate fresh build/runFiles directory
4. Push to origin staging (which triggers automatic deployment)
5. Switch back to main branch

The staging site will be available at: https://dnotario.github.io/skull-score-staging/
