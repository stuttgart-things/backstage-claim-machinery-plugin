# Backstage Claim Machinery Integration

This plugin integrates the Claim Machinery API with Backstage, providing custom scaffolder field extensions and actions for rendering claim templates.

## Features

- **Custom Field Extensions**: Dynamic dropdown for claim templates and auto-generated parameter forms
- **Backend Action**: Render claim templates via the Claim Machinery API
- **Template Examples**: Ready-to-use templates for creating merge requests with rendered claims
- **GitLab Integration**: Automatically create merge requests with rendered manifests
- **Configurable**: API URL configurable via `app-config.yaml` - no code changes needed

## Components

### Backend Plugin
- **Custom Scaffolder Action**: `claim-machinery:render`
- Fetches templates from Claim Machinery API
- Renders manifests with user-provided parameters
- Outputs manifest content for subsequent steps

### Frontend Plugin
- **ClaimMachineryPicker**: Dropdown selector for claim templates
- **ClaimMachineryParameters**: Dynamic form generator for template parameters
- Fetches available templates from API
- Provides real-time parameter validation

## Installation

### Prerequisites

- Backstage instance (v1.x with new backend system)
- Claim Machinery API accessible from your Backstage backend
- GitLab integration configured (for merge request templates)

### Step 1: Copy Plugin Files

```bash
# Set your directories
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

### Step 2: Install Dependencies

```bash
# Frontend dependencies
cd $BACKSTAGE_DIR/packages/app
yarn add @backstage/plugin-scaffolder-react

# Backend dependencies
cd $BACKSTAGE_DIR/packages/backend
yarn add fs-extra node-fetch@2
yarn add -D @types/fs-extra @types/node-fetch
```

### Step 3: Register Backend Action (New Backend System)

The plugin includes a `module.ts` that registers the action using the new Backstage backend system.

Edit `packages/backend/src/index.ts`:

```typescript
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

// ... other plugins ...

// scaffolder plugin
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));

// claim-machinery custom scaffolder action
backend.add(import('./plugins/scaffolder-claim-machinery/module'));

// ... rest of plugins ...

backend.start();
```

The module (`packages/backend/src/plugins/scaffolder-claim-machinery/module.ts`) automatically injects the Backstage config to read the API URL:

```typescript
import { createBackendModule, coreServices } from '@backstage/backend-plugin-api';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node';
import { claimMachineryRenderAction } from './action';

export default createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'claim-machinery',

  register(env) {
    env.registerInit({
      deps: {
        scaffolderActions: scaffolderActionsExtensionPoint,
        config: coreServices.rootConfig,
      },
      async init({ scaffolderActions, config }) {
        scaffolderActions.addActions(
          claimMachineryRenderAction({ config }),
        );
      },
    });
  },
});
```

### Step 4: Register Frontend Field Extensions

Create an index file to export the field extensions at `packages/app/src/scaffolder/ClaimMachineryPicker/index.ts`:

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

Then register them in `packages/app/src/App.tsx`:

```typescript
import { ScaffolderPage, scaffolderPlugin, ScaffolderFieldExtensions } from '@backstage/plugin-scaffolder';
import {
  ClaimMachineryPickerFieldExtension,
  ClaimMachineryParametersFieldExtension,
} from './scaffolder/ClaimMachineryPicker';

// ... in your routes ...

<Route path="/create" element={<ScaffolderPage />}>
  <ScaffolderFieldExtensions>
    <ClaimMachineryPickerFieldExtension />
    <ClaimMachineryParametersFieldExtension />
  </ScaffolderFieldExtensions>
</Route>
```

### Step 5: Configure Claim Machinery API URL

Add the configuration to `app-config.yaml`:

```yaml
# Claim Machinery configuration
claimMachinery:
  apiUrl: ${CLAIM_MACHINERY_API_URL:-http://your-claim-machinery-api:8080}

# Proxy for frontend requests
proxy:
  endpoints:
    '/claim-machinery':
      target: ${CLAIM_MACHINERY_API_URL:-http://your-claim-machinery-api:8080}
      changeOrigin: true
      pathRewrite:
        '^/api/proxy/claim-machinery': ''
      allowedHeaders: ['*']
      credentials: 'dangerously-allow-unauthenticated'
```

The API URL can be configured in two ways:

1. **Environment variable** (recommended for different environments):
   ```bash
   export CLAIM_MACHINERY_API_URL=http://your-api:8080
   ```

2. **Direct in app-config.yaml**:
   ```yaml
   claimMachinery:
     apiUrl: http://your-api:8080
   ```

### Step 6: Add Templates to Catalog

Add the templates to your `app-config.yaml`:

```yaml
catalog:
  locations:
    # ... existing locations ...

    # Claim Machinery templates
    - type: file
      target: ../../test-templates/claim-template.yaml
      rules:
        - allow: [Template]
    - type: file
      target: ../../test-templates/claim-to-merge-request.yaml
      rules:
        - allow: [Template]
```

## Configuration Reference

### app-config.yaml

```yaml
# Claim Machinery API configuration
claimMachinery:
  # The URL of the Claim Machinery API
  # Used by the backend scaffolder action
  apiUrl: ${CLAIM_MACHINERY_API_URL:-http://localhost:8080}

# Proxy configuration for frontend requests
proxy:
  endpoints:
    '/claim-machinery':
      # Should match claimMachinery.apiUrl
      target: ${CLAIM_MACHINERY_API_URL:-http://localhost:8080}
      changeOrigin: true
      pathRewrite:
        '^/api/proxy/claim-machinery': ''
      allowedHeaders: ['*']
      credentials: 'dangerously-allow-unauthenticated'
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `CLAIM_MACHINERY_API_URL` | URL of the Claim Machinery API | `http://localhost:8080` |

## Usage

### Using the Custom Field Extensions

In your scaffolder templates, use the custom fields:

```yaml
parameters:
  - title: Claim Configuration
    properties:
      claimTemplate:
        title: Claim Template
        type: string
        ui:field: ClaimMachineryPicker

      parameters:
        title: Template Parameters
        type: object
        ui:field: ClaimMachineryParameters
```

### Using the Backend Action

In your template steps:

```yaml
steps:
  - id: render
    name: Render Claim
    action: claim-machinery:render
    input:
      template: ${{ parameters.claimTemplate }}
      parameters: ${{ parameters.parameters }}
      outputPath: 'claims'

  # Access the rendered manifest in subsequent steps
  - id: log
    name: Show Manifest
    action: debug:log
    input:
      message: ${{ steps['render'].output.manifest }}
```

### Action Outputs

The `claim-machinery:render` action provides:

- `manifest`: The full rendered YAML manifest as a string
- `filePath`: The filename of the saved manifest (e.g., `volumeclaim-simple.yaml`)

## Example Templates

### 1. Simple Claim Rendering (`claim-template.yaml`)

Renders a claim and displays the manifest with options to create a merge request.

### 2. Claim to Merge Request (`claim-to-merge-request.yaml`)

Complete workflow that:
1. Renders a claim from the API
2. Creates a GitLab merge request
3. Commits the manifest to the repository
4. Provides links to review and merge

## Customization

### Change Target Repository

Edit the templates to point to your repository:

```yaml
- action: publish:gitlab:merge-request
  input:
    repoUrl: your-gitlab.com?owner=your-org&repo=your-repo
```

### Add Custom Validation

Extend the field components in `frontend/ClaimMachineryPicker/` to add custom validation logic.

## Troubleshooting

### "socket hang up" errors

If you see connection errors, check:
1. API is accessible from the backend container
2. Correct hostname is used (not localhost if running in containers)
3. Firewall/network policies allow connections

### "Unexpected token '<', "<!DOCTYPE"..." errors

This means the frontend is getting HTML instead of JSON:
1. Check proxy configuration in `app-config.yaml`
2. Verify the backend URL is correct
3. Check browser network tab for the actual request URL

### Field extensions not showing up

1. Verify `@backstage/plugin-scaffolder-react` is installed
2. Check field extensions are registered in `App.tsx` inside `<ScaffolderFieldExtensions>`
3. Ensure you're using `scaffolderPlugin.provide()` to create the extensions
4. Restart the development server

### Dropdown is empty

1. Check `claimMachinery.apiUrl` in `app-config.yaml`
2. Verify proxy configuration in `app-config.yaml`
3. Test API manually: `curl http://YOUR-API:8080/api/v1/claim-templates`
4. Check browser console for errors

### "Gateway Timeout" errors

1. Verify the Claim Machinery API is running
2. Check the API URL is correct in `app-config.yaml`
3. Ensure network connectivity between Backstage and the API

## Architecture

```
+----------------------------------------------------------+
|                    Backstage Frontend                     |
|  +----------------------------------------------------+  |
|  |  ClaimMachineryPicker (Dropdown)                   |  |
|  |  ClaimMachineryParameters (Dynamic Form)           |  |
|  +----------------------------------------------------+  |
|                        |                                  |
|                        | fetch()                          |
|                        v                                  |
+----------------------------------------------------------+
                         |
                         | HTTP (port 7007)
                         v
+----------------------------------------------------------+
|                    Backstage Backend                      |
|  +----------------------------------------------------+  |
|  |  Proxy: /api/proxy/claim-machinery                 |  |
|  |  Action: claim-machinery:render                    |  |
|  |  Config: claimMachinery.apiUrl                     |  |
|  +----------------------------------------------------+  |
|                        |                                  |
|                        | HTTP                              |
|                        v                                  |
+----------------------------------------------------------+
                         |
                         v
+----------------------------------------------------------+
|              Claim Machinery API                          |
|  - GET  /api/v1/claim-templates (list)                   |
|  - GET  /api/v1/claim-templates/{name} (details)         |
|  - POST /api/v1/claim-templates/{name}/order (render)    |
+----------------------------------------------------------+
```

## API Reference

### Backend Action: `claim-machinery:render`

**Input:**
- `template` (string, required): Name of the claim template
- `parameters` (object, optional): Template parameters
- `outputPath` (string, optional): Directory to save the manifest (default: '.')

**Output:**
- `manifest` (string): The rendered YAML manifest
- `filePath` (string): The filename of the saved manifest

**Configuration:**
- Reads API URL from `claimMachinery.apiUrl` in `app-config.yaml`

### Field Extension: ClaimMachineryPicker

Displays a dropdown of available claim templates fetched from the API.

**Schema:**
```yaml
claimTemplate:
  type: string
  ui:field: ClaimMachineryPicker
```

### Field Extension: ClaimMachineryParameters

Dynamically generates form fields based on the selected template's parameter schema.

**Schema:**
```yaml
parameters:
  type: object
  ui:field: ClaimMachineryParameters
```

**Supported Parameter Types:**
- `string`: Text input
- `boolean`: Checkbox
- `array`: Comma-separated text input
- `enum`: Dropdown selector

## Contributing

To contribute improvements:

1. Make changes to the components
2. Test in your Backstage instance
3. Update documentation
4. Share your changes

## License

Apache-2.0

## Support

For issues related to:
- **Claim Machinery API**: Contact your platform team
- **Backstage Integration**: Check Backstage documentation
- **This Plugin**: Review troubleshooting section above
