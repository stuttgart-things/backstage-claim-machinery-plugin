# Quick Start Guide

Get the Claim Machinery integration running in your Backstage instance in under 15 minutes.

## Prerequisites

- Backstage instance running (with new backend system)
- Claim Machinery API accessible
- GitLab integration configured (optional, for merge request features)

## Installation Steps

### 1. Copy Files

```bash
# Set your Backstage directory
BACKSTAGE_DIR="/path/to/your/backstage"
PLUGIN_DIR="/path/to/backstage-claim-machinery-plugin"

# Copy backend plugin
cp -r $PLUGIN_DIR/backend/scaffolder-claim-machinery \
      $BACKSTAGE_DIR/packages/backend/src/plugins/

# Copy frontend components
mkdir -p $BACKSTAGE_DIR/packages/app/src/scaffolder
cp -r $PLUGIN_DIR/frontend/ClaimMachineryPicker \
      $BACKSTAGE_DIR/packages/app/src/scaffolder/

# Copy templates
mkdir -p $BACKSTAGE_DIR/test-templates
cp $PLUGIN_DIR/templates/*.yaml $BACKSTAGE_DIR/test-templates/
```

### 2. Install Dependencies

```bash
# Frontend
cd $BACKSTAGE_DIR/packages/app
yarn add @backstage/plugin-scaffolder-react

# Backend
cd $BACKSTAGE_DIR/packages/backend
yarn add fs-extra node-fetch@2
yarn add -D @types/fs-extra @types/node-fetch
```

### 3. Register Backend Action

Edit `packages/backend/src/index.ts` and add:

```typescript
// After other scaffolder imports
backend.add(import('./plugins/scaffolder-claim-machinery/module'));
```

Full example:
```typescript
// scaffolder plugin
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));

// claim-machinery custom scaffolder action
backend.add(import('./plugins/scaffolder-claim-machinery/module'));
```

### 4. Create Frontend Field Extension Index

Create `packages/app/src/scaffolder/ClaimMachineryPicker/index.ts`:

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

### 5. Register Frontend Field Extensions

Edit `packages/app/src/App.tsx`:

Add imports at the top:
```typescript
import { ScaffolderPage, scaffolderPlugin, ScaffolderFieldExtensions } from '@backstage/plugin-scaffolder';
import {
  ClaimMachineryPickerFieldExtension,
  ClaimMachineryParametersFieldExtension,
} from './scaffolder/ClaimMachineryPicker';
```

Update the scaffolder route (find the `/create` route):
```typescript
<Route path="/create" element={<ScaffolderPage />}>
  <ScaffolderFieldExtensions>
    <ClaimMachineryPickerFieldExtension />
    <ClaimMachineryParametersFieldExtension />
  </ScaffolderFieldExtensions>
</Route>
```

### 6. Add Proxy Configuration

Add to `app-config.yaml`:

```yaml
proxy:
  endpoints:
    '/claim-machinery':
      target: ${CLAIM_MACHINERY_API_URL:-http://YOUR-CLAIM-MACHINERY-API:8080}
      changeOrigin: true
      pathRewrite:
        '^/api/proxy/claim-machinery': ''
      allowedHeaders: ['*']
      credentials: 'dangerously-allow-unauthenticated'
```

### 7. Add Templates to Catalog

Add to `app-config.yaml`:

```yaml
catalog:
  locations:
    # ... existing locations ...

    - type: file
      target: ../../test-templates/claim-template.yaml
      rules:
        - allow: [Template]
    - type: file
      target: ../../test-templates/claim-to-merge-request.yaml
      rules:
        - allow: [Template]
```

### 8. Configure API URL (Optional)

Edit `packages/backend/src/plugins/scaffolder-claim-machinery/action.ts` line ~23:

```typescript
const baseUrl = 'http://YOUR-CLAIM-MACHINERY-API:8080';
```

### 9. Start Backstage

```bash
cd $BACKSTAGE_DIR
yarn dev
```

## Verify Installation

1. Navigate to **Create** in Backstage
2. Look for these templates:
   - "Test Claim Machinery"
   - "Create Claim via Merge Request"
3. Open a template and verify:
   - Claim Template dropdown is populated
   - Parameters form appears when you select a template

## You're Done!

Try creating a claim:
1. Select "Create Claim via Merge Request"
2. Choose a claim template from dropdown
3. Fill in the dynamic parameters
4. Click "Review" and "Create"
5. Check the merge request link in the output!

## Troubleshooting

**Dropdown is empty?**
- Check API URL in `action.ts`
- Check proxy configuration in `app-config.yaml`
- Verify API is accessible: `curl http://YOUR-API:8080/api/v1/claim-templates`

**Field extensions not showing?**
- Verify `@backstage/plugin-scaffolder-react` is installed
- Check field extensions are registered in `App.tsx` inside `<ScaffolderFieldExtensions>`
- Make sure you created the `index.ts` file with `scaffolderPlugin.provide()`
- Restart Backstage

**Backend action fails?**
- Check backend logs for errors
- Verify API endpoint is correct
- Test API manually: `curl -X POST http://YOUR-API:8080/api/v1/claim-templates/TEMPLATE-NAME/order`

## Next Steps

- Read [README.md](README.md) for detailed documentation
- Customize templates for your use case
- Add more scaffolder actions
- Integrate with your CI/CD pipeline

## Tips

- Use `claim-to-merge-request.yaml` for production workflows
- Customize the GitLab repository URL in templates
- Add validation to parameter inputs
- Create more templates for different claim types
