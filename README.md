# Backstage Claim Machinery Integration

This plugin integrates the Claim Machinery API with Backstage, providing custom scaffolder field extensions and actions for rendering claim templates.

## Features

- 🎯 **Custom Field Extensions**: Dynamic dropdown for claim templates and auto-generated parameter forms
- 🔄 **Backend Action**: Render claim templates via the Claim Machinery API
- 📝 **Template Examples**: Ready-to-use templates for creating merge requests with rendered claims
- 🚀 **GitLab Integration**: Automatically create merge requests with rendered manifests

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

- Backstage instance (v1.x)
- Claim Machinery API accessible from your Backstage backend
- GitLab integration configured (for merge request templates)

### Step 1: Install Backend Action

1. Copy the backend action to your Backstage backend:

```bash
cp -r backend/scaffolder-claim-machinery packages/backend/src/plugins/
```

2. Register the action in your backend (`packages/backend/src/index.ts`):

```typescript
import { claimMachineryRenderAction } from './plugins/scaffolder-claim-machinery/action';

// In your backend setup, add the action to scaffolder:
backend.add(import('@backstage/plugin-scaffolder-backend/alpha'));

// Register the custom action
const env = useHotMemoize(module, () => createEnv('scaffolder'));
const catalogClient = new CatalogClient({
  discoveryApi: env.discovery,
});

backend.add(
  scaffolderActionsExtensionPoint,
  scaffolderActionsExtensionPoint => {
    scaffolderActionsExtensionPoint.addActions(
      claimMachineryRenderAction(),
    );
  },
);
```

Or if using the new backend system, register in `packages/backend/src/plugins/scaffolder.ts`:

```typescript
import { claimMachineryRenderAction } from './scaffolder-claim-machinery/action';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    // ... other config
    actions: [
      // ... other actions
      claimMachineryRenderAction(),
    ],
  });
}
```

3. Update the API base URL in `backend/scaffolder-claim-machinery/action.ts`:

```typescript
const baseUrl = 'http://your-claim-machinery-api:8080';
```

### Step 2: Configure Backend Proxy

Add the proxy configuration to `app-config.yaml`:

```yaml
proxy:
  endpoints:
    '/claim-machinery':
      target: 'http://your-claim-machinery-api:8080'
      changeOrigin: true
      pathRewrite:
        '^/api/proxy/claim-machinery': ''
      allowedHeaders: ['*']
      credentials: 'dangerously-allow-unauthenticated'
```

### Step 3: Install Frontend Components

1. Copy the frontend components to your Backstage app:

```bash
cp -r frontend/ClaimMachineryPicker packages/app/src/scaffolder/
```

2. Install required dependency:

```bash
cd packages/app
yarn add @backstage/plugin-scaffolder-react
```

3. Register the field extensions in `packages/app/src/apis.ts`:

```typescript
import { formFieldsApiRef } from '@backstage/plugin-scaffolder-react/alpha';
import { ClaimMachineryPickerExtension } from './scaffolder/ClaimMachineryPicker/ClaimMachineryPickerExtension';
import { ClaimMachineryParametersExtension } from './scaffolder/ClaimMachineryPicker/ClaimMachineryParametersExtension';

export const apis: AnyApiFactory[] = [
  // ... existing apis
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

### Step 4: Add Templates to Catalog

Add the templates to your `app-config.yaml`:

```yaml
catalog:
  locations:
    - type: file
      target: ../../path/to/claim-template.yaml
      rules:
        - allow: [Template]
    - type: file
      target: ../../path/to/claim-to-merge-request.yaml
      rules:
        - allow: [Template]
```

### Step 5: Configure Environment Variables

Set the backend URL in your `.env` file:

```bash
BASE_URL=http://your-backstage-instance:3000
BACKEND_URL=http://your-backstage-instance:7007
```

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

### Change API Endpoint

Edit `backend/scaffolder-claim-machinery/action.ts`:

```typescript
const baseUrl = 'http://your-custom-api:8080';
```

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
1. Ensure `BACKEND_URL` is set in `.env`
2. Check proxy configuration in `app-config.yaml`
3. Verify the config API is properly imported in components

### Field extensions not showing up

1. Verify `@backstage/plugin-scaffolder-react` is installed
2. Check field extensions are registered in `apis.ts`
3. Restart the development server

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Backstage Frontend                    │
│  ┌─────────────────────────────────────────────────┐   │
│  │  ClaimMachineryPicker (Dropdown)                │   │
│  │  ClaimMachineryParameters (Dynamic Form)        │   │
│  └─────────────────────────────────────────────────┘   │
│                        │                                 │
│                        │ fetch()                         │
│                        ▼                                 │
└─────────────────────────────────────────────────────────┘
                         │
                         │ HTTP (port 7007)
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    Backstage Backend                     │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Proxy: /api/proxy/claim-machinery              │   │
│  │  Action: claim-machinery:render                 │   │
│  └─────────────────────────────────────────────────┘   │
│                        │                                 │
│                        │ HTTP (port 8080)               │
│                        ▼                                 │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Claim Machinery API                         │
│  - GET  /api/v1/claim-templates (list)                 │
│  - GET  /api/v1/claim-templates/{name} (details)       │
│  - POST /api/v1/claim-templates/{name}/order (render)  │
└─────────────────────────────────────────────────────────┘
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

Same as your Backstage instance.

## Support

For issues related to:
- **Claim Machinery API**: Contact your platform team
- **Backstage Integration**: Check Backstage documentation
- **This Plugin**: Review troubleshooting section above
