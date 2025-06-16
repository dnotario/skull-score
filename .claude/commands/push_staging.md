Push the current main branch changes to the staging environment following the deployment workflow described in the README. This will:

1. Switch to the staging branch
2. Merge main into staging 
3. Push to origin staging (which triggers automatic deployment)
4. Switch back to main branch

The staging site will be available at: https://dnotario.github.io/skull-score-staging/