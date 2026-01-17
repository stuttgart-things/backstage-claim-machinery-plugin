# Installation Checklist

Use this checklist to ensure you've completed all installation steps.

## Pre-Installation

- [ ] Backstage instance is running (new backend system)
- [ ] You have access to modify Backstage configuration
- [ ] Claim Machinery API is accessible
- [ ] You know your Claim Machinery API URL
- [ ] GitLab integration is configured (optional)
- [ ] You have GitLab token with repository access (optional)

## File Copy

- [ ] Copied `backend/scaffolder-claim-machinery/` to `packages/backend/src/plugins/`
- [ ] Copied `frontend/ClaimMachineryPicker/` to `packages/app/src/scaffolder/`
- [ ] Copied template files to a templates directory (e.g., `test-templates/`)

## Dependencies

- [ ] Installed frontend dependencies:
  ```bash
  cd packages/app && yarn add @backstage/plugin-scaffolder-react
  ```

- [ ] Installed backend dependencies:
  ```bash
  cd packages/backend && yarn add fs-extra node-fetch@2
  yarn add -D @types/fs-extra @types/node-fetch
  ```

## Configuration Files

### Backend Action Configuration
- [ ] Updated API URL in `packages/backend/src/plugins/scaffolder-claim-machinery/action.ts` (line ~23)
  - Changed: `http://YOUR-API:8080` to `http://your-actual-api:8080`

### app-config.yaml
- [ ] Added proxy configuration:
  ```yaml
  proxy:
    endpoints:
      '/claim-machinery':
        target: ${CLAIM_MACHINERY_API_URL:-http://your-api:8080}
        changeOrigin: true
        pathRewrite:
          '^/api/proxy/claim-machinery': ''
        allowedHeaders: ['*']
        credentials: 'dangerously-allow-unauthenticated'
  ```

- [ ] Added catalog locations:
  ```yaml
  catalog:
    locations:
      - type: file
        target: ../../test-templates/claim-template.yaml
        rules:
          - allow: [Template]
      - type: file
        target: ../../test-templates/claim-to-merge-request.yaml
        rules:
          - allow: [Template]
  ```

### Environment Variables (Optional)
- [ ] Set `CLAIM_MACHINERY_API_URL` if using environment variable for proxy target
- [ ] (Optional) Set `GITLAB_TOKEN` for merge request functionality

## Code Integration

### Backend (packages/backend/src/index.ts)

- [ ] Added the claim-machinery module import:
  ```typescript
  // scaffolder plugin
  backend.add(import('@backstage/plugin-scaffolder-backend'));
  backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));

  // claim-machinery custom scaffolder action
  backend.add(import('./plugins/scaffolder-claim-machinery/module'));
  ```

### Frontend Field Extension Index

- [ ] Created `packages/app/src/scaffolder/ClaimMachineryPicker/index.ts`:
  ```typescript
  import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
  import { createScaffolderFieldExtension } from '@backstage/plugin-scaffolder-react';
  import { ClaimMachineryPickerExtension } from './ClaimMachineryPickerExtension';
  import { ClaimMachineryParametersExtension } from './ClaimMachineryParametersExtension';

  export const ClaimMachineryPickerFieldExtension = scaffolderPlugin.provide(
    createScaffolderFieldExtension({
      name: 'ClaimMachineryPicker',
      component: ClaimMachineryPickerExtension,
    }),
  );

  export const ClaimMachineryParametersFieldExtension = scaffolderPlugin.provide(
    createScaffolderFieldExtension({
      name: 'ClaimMachineryParameters',
      component: ClaimMachineryParametersExtension,
    }),
  );
  ```

### Frontend App.tsx (packages/app/src/App.tsx)

- [ ] Added imports:
  ```typescript
  import { ScaffolderPage, scaffolderPlugin, ScaffolderFieldExtensions } from '@backstage/plugin-scaffolder';
  import {
    ClaimMachineryPickerFieldExtension,
    ClaimMachineryParametersFieldExtension,
  } from './scaffolder/ClaimMachineryPicker';
  ```

- [ ] Updated the `/create` route:
  ```typescript
  <Route path="/create" element={<ScaffolderPage />}>
    <ScaffolderFieldExtensions>
      <ClaimMachineryPickerFieldExtension />
      <ClaimMachineryParametersFieldExtension />
    </ScaffolderFieldExtensions>
  </Route>
  ```

## Template Customization (Optional)

- [ ] Updated GitLab repository URL in templates (if needed):
  - File: `templates/claim-to-merge-request.yaml`
  - Change: `repoUrl` value to your repository

- [ ] Adjusted target paths (optional)
- [ ] Customized branch naming (optional)
- [ ] Modified MR descriptions (optional)

## Verification

- [ ] Started Backstage: `yarn dev`
- [ ] No compilation errors in terminal
- [ ] Backend started successfully (port 7007)
- [ ] Frontend started successfully (port 3000)

### In Backstage UI:
- [ ] Navigated to "Create" page
- [ ] Found "Test Claim Machinery" template
- [ ] Found "Create Claim via Merge Request" template
- [ ] Opened a template
- [ ] Claim Template dropdown is populated with templates
- [ ] Selected a template
- [ ] Dynamic parameters form appeared
- [ ] Filled in parameters
- [ ] Clicked "Review"
- [ ] Reviewed the form data
- [ ] Clicked "Create"

### Expected Output:
- [ ] Task executed successfully
- [ ] Saw "Render Claim" step complete
- [ ] Saw rendered manifest in logs
- [ ] (If using MR template) Saw merge request URL
- [ ] (If using MR template) Merge request created in GitLab

## Testing

### Manual API Tests:
- [ ] Test API connectivity from your machine:
  ```bash
  curl http://your-api:8080/api/v1/claim-templates
  ```

- [ ] Test backend proxy:
  ```bash
  curl http://localhost:7007/api/proxy/claim-machinery/api/v1/claim-templates
  ```

- [ ] Test template rendering:
  ```bash
  curl -X POST http://your-api:8080/api/v1/claim-templates/volumeclaim-simple/order \
    -H "Content-Type: application/json" \
    -d '{"parameters": {"namespace": "test"}}'
  ```

### Browser Tests:
- [ ] Opened browser dev console
- [ ] No CORS errors
- [ ] No 404 errors for API calls
- [ ] Network tab shows successful API calls

## Troubleshooting Checks

If something doesn't work:

### Dropdown Empty
- [ ] Check browser console for errors
- [ ] Verify API URL in action.ts
- [ ] Test API manually with curl
- [ ] Check proxy configuration
- [ ] Verify backend is using correct URL

### Field Extensions Not Showing
- [ ] Verify `@backstage/plugin-scaffolder-react` is installed
- [ ] Check that `index.ts` exists with `scaffolderPlugin.provide()` calls
- [ ] Check App.tsx has `<ScaffolderFieldExtensions>` wrapper
- [ ] Restart Backstage
- [ ] Check browser console for errors

### Backend Action Fails
- [ ] Check backend logs
- [ ] Verify API endpoint is correct
- [ ] Test API with curl from backend container/host
- [ ] Check network connectivity
- [ ] Verify timeout is sufficient

### Merge Request Fails
- [ ] Verify GitLab token is set
- [ ] Check repository exists
- [ ] Verify user has write access
- [ ] Check GitLab integration in app-config.yaml

## Post-Installation

- [ ] Documented your configuration for team
- [ ] Created internal runbook (if needed)
- [ ] Trained team members on usage
- [ ] Set up monitoring (optional)
- [ ] Configured backups (optional)

## Next Steps

- [ ] Read full [README.md](README.md)
- [ ] Customize templates for your use cases
- [ ] Create additional templates
- [ ] Integrate with CI/CD pipelines
- [ ] Add custom validation
- [ ] Set up production deployment

## Notes

Space for your installation notes:

```
Installation Date: _______________
Installed By: _______________
API URL: _______________
Special Configuration:




```

## Sign-Off

Installation completed by: _______________

Date: _______________

Verified by: _______________

Date: _______________
