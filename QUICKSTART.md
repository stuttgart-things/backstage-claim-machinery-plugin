# Quick Start Guide

Get the Claim Machinery integration running in your Backstage instance in 5 minutes.

## Prerequisites

✅ Backstage instance running
✅ Claim Machinery API accessible
✅ GitLab integration configured (optional, for merge request features)

## Installation Steps

### 1️⃣ Copy Files (2 minutes)

```bash
# Set your Backstage directory
BACKSTAGE_DIR="/path/to/your/backstage"
PLUGIN_DIR="/home/sthings/projects/backstage-claim-machinery-plugin"

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

### 2️⃣ Install Dependencies (1 minute)

```bash
cd $BACKSTAGE_DIR/packages/app
yarn add @backstage/plugin-scaffolder-react
```

### 3️⃣ Configure API URL (1 minute)

Edit `packages/backend/src/plugins/scaffolder-claim-machinery/action.ts`:

```typescript
// Line 35: Update this URL
const baseUrl = 'http://YOUR-CLAIM-MACHINERY-API:8080';
```

### 4️⃣ Add Proxy Configuration (1 minute)

Add to `app-config.yaml`:

```yaml
proxy:
  endpoints:
    '/claim-machinery':
      target: 'http://YOUR-CLAIM-MACHINERY-API:8080'
      changeOrigin: true
      pathRewrite:
        '^/api/proxy/claim-machinery': ''
      allowedHeaders: ['*']
      credentials: 'dangerously-allow-unauthenticated'
```

### 5️⃣ Register Field Extensions (2 minutes)

Edit `packages/app/src/apis.ts`:

```typescript
import { formFieldsApiRef } from '@backstage/plugin-scaffolder-react/alpha';
import { ClaimMachineryPickerExtension } from './scaffolder/ClaimMachineryPicker/ClaimMachineryPickerExtension';
import { ClaimMachineryParametersExtension } from './scaffolder/ClaimMachineryPicker/ClaimMachineryParametersExtension';

export const apis: AnyApiFactory[] = [
  // ... existing apis ...

  // Add this at the end:
  createApiFactory({
    api: formFieldsApiRef,
    deps: {},
    factory: () => ({
      getFormFields: async () => [
        {
          component: ClaimMachineryPickerExtension,
          name: 'ClaimMachineryPicker',
        },
        {
          component: ClaimMachineryParametersExtension,
          name: 'ClaimMachineryParameters',
        },
      ],
    }),
  }),
];
```

### 6️⃣ Register Backend Action (2 minutes)

**Option A: New Backend System**

Edit `packages/backend/src/index.ts`:

```typescript
import { createBackend } from '@backstage/backend-defaults';
import { claimMachineryRenderAction } from './plugins/scaffolder-claim-machinery/action';

const backend = createBackend();

// ... other plugins ...

backend.add(import('@backstage/plugin-scaffolder-backend/alpha'));

// Register the action
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';

backend.add(
  createBackendModule({
    pluginId: 'scaffolder',
    moduleId: 'claim-machinery',
    register(reg) {
      reg.registerInit({
        deps: {
          scaffolder: scaffolderActionsExtensionPoint,
        },
        async init({ scaffolder }) {
          scaffolder.addActions(claimMachineryRenderAction());
        },
      });
    },
  })(),
);

backend.start();
```

**Option B: Legacy Backend System**

Edit `packages/backend/src/plugins/scaffolder.ts`:

```typescript
import { claimMachineryRenderAction } from './scaffolder-claim-machinery/action';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    reader: env.reader,
    catalogClient,
    identity: env.identity,
    permissions: env.permissions,
    actions: [
      ...builtInActions,
      claimMachineryRenderAction(),  // Add this line
    ],
  });
}
```

### 7️⃣ Add Templates to Catalog (1 minute)

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

### 8️⃣ Set Environment Variables (30 seconds)

Edit `.env` file:

```bash
BASE_URL=http://your-backstage:3000
BACKEND_URL=http://your-backstage:7007
```

### 9️⃣ Start Backstage (30 seconds)

```bash
cd $BACKSTAGE_DIR
yarn dev
```

## ✅ Verify Installation

1. Navigate to **Create** in Backstage
2. Look for these templates:
   - "Test Claim Machinery"
   - "Create Claim via Merge Request"
3. Open a template and verify:
   - Claim Template dropdown is populated
   - Parameters form appears when you select a template

## 🎉 You're Done!

Try creating a claim:
1. Select "Create Claim via Merge Request"
2. Choose a claim template from dropdown
3. Fill in the dynamic parameters
4. Click "Review" and "Create"
5. Check the merge request link in the output!

## 🐛 Troubleshooting

**Dropdown is empty?**
- Check API URL in `action.ts`
- Check proxy configuration in `app-config.yaml`
- Verify API is accessible: `curl http://YOUR-API:8080/api/v1/claim-templates`

**Field extensions not showing?**
- Verify `@backstage/plugin-scaffolder-react` is installed
- Check field extensions are registered in `apis.ts`
- Restart Backstage

**Backend action fails?**
- Check backend logs for errors
- Verify API endpoint is correct
- Test API manually: `curl -X POST http://YOUR-API:8080/api/v1/claim-templates/TEMPLATE-NAME/order`

## 📚 Next Steps

- Read [README.md](README.md) for detailed documentation
- Customize templates for your use case
- Add more scaffolder actions
- Integrate with your CI/CD pipeline

## 💡 Tips

- Use `claim-to-merge-request.yaml` for production workflows
- Customize the GitLab repository URL in templates
- Add validation to parameter inputs
- Create more templates for different claim types
