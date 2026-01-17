# File Structure

This document explains the purpose of each file in the Claim Machinery plugin.

## Directory Structure

```
backstage-claim-machinery-plugin/
├── backend/
│   └── scaffolder-claim-machinery/
│       ├── action.ts                    # Custom scaffolder action
│       ├── index.ts                     # Module export
│       └── module.ts                    # Backend module for new backend system
├── frontend/
│   └── ClaimMachineryPicker/
│       ├── ClaimMachineryPickerExtension.tsx        # Template dropdown
│       ├── ClaimMachineryParametersExtension.tsx    # Dynamic parameters form
│       └── index.ts                                  # Component exports
├── templates/
│   ├── claim-template.yaml              # Simple test template
│   └── claim-to-merge-request.yaml      # Production MR template
├── docs/
│   ├── app-config.example.yaml          # Configuration examples
│   ├── FILE_STRUCTURE.md                # This file
│   └── API.md                           # API documentation
├── README.md                             # Full documentation
└── QUICKSTART.md                         # Installation guide
```

## Backend Files

### `backend/scaffolder-claim-machinery/action.ts`

**Purpose**: Custom Backstage scaffolder action for rendering claim templates

**Key Features**:
- Fetches claim templates from Claim Machinery API
- Renders templates with user-provided parameters
- Saves manifests to workspace
- Outputs manifest content for subsequent steps
- Includes timeout handling and error logging

**Configuration**:
- `baseUrl` (line 35): Set to your Claim Machinery API endpoint

**Inputs**:
- `template`: Name of the claim template
- `parameters`: Template parameters as object
- `outputPath`: Directory to save the manifest

**Outputs**:
- `manifest`: Full rendered YAML manifest
- `filePath`: Filename of saved manifest

**Dependencies**:
- `@backstage/plugin-scaffolder-node`
- `fs-extra`
- `node-fetch`
- `@backstage/types`

---

### `backend/scaffolder-claim-machinery/module.ts`

**Purpose**: Backend module for the new Backstage backend system

**Content**:
```typescript
import { createBackendModule } from '@backstage/backend-plugin-api';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node';
import { claimMachineryRenderAction } from './action';

export default createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'claim-machinery',

  register(env) {
    env.registerInit({
      deps: {
        scaffolderActions: scaffolderActionsExtensionPoint,
      },
      async init({ scaffolderActions }) {
        scaffolderActions.addActions(
          claimMachineryRenderAction(),
        );
      },
    });
  },
});
```

---

### `backend/scaffolder-claim-machinery/index.ts`

**Purpose**: Export barrel file

**Content**:
```typescript
export { default } from './module';
```

## Frontend Files

### `frontend/ClaimMachineryPicker/ClaimMachineryPickerExtension.tsx`

**Purpose**: Custom scaffolder field for selecting claim templates

**Key Features**:
- Fetches available templates from API on mount
- Displays templates in a Material-UI Select dropdown
- Shows template details (description, tags, parameters) when selected
- Handles loading and error states
- Uses Backstage Config API to get backend URL

**Usage in Templates**:
```yaml
claimTemplate:
  type: string
  ui:field: ClaimMachineryPicker
```

**API Calls**:
- `GET ${backendUrl}/api/proxy/claim-machinery/api/v1/claim-templates`

**Dependencies**:
- `@backstage/plugin-scaffolder-react`
- `@backstage/core-plugin-api`
- `@material-ui/core`
- `react`

---

### `frontend/ClaimMachineryPicker/ClaimMachineryParametersExtension.tsx`

**Purpose**: Dynamic form generator for claim template parameters

**Key Features**:
- Watches form context for selected template
- Fetches template details when template changes
- Dynamically generates form fields based on parameter schema
- Supports multiple input types (text, boolean, enum, array)
- Initializes with default values
- Provides validation and help text

**Supported Parameter Types**:
- `string`: Text input with pattern/length validation
- `boolean`: Checkbox
- `enum`: Dropdown with predefined options
- `array`: Comma-separated text input

**Usage in Templates**:
```yaml
parameters:
  type: object
  ui:field: ClaimMachineryParameters
```

**API Calls**:
- `GET ${backendUrl}/api/proxy/claim-machinery/api/v1/claim-templates/{name}`

**Dependencies**:
- Same as ClaimMachineryPickerExtension

---

### `frontend/ClaimMachineryPicker/index.ts`

**Purpose**: Export field extensions using `scaffolderPlugin.provide()`

**Content** (to be created in target Backstage app):
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

**Note**: This file needs to be created during installation as it uses `scaffolderPlugin.provide()` to properly register the field extensions with Backstage.

## Template Files

### `templates/claim-template.yaml`

**Purpose**: Simple test template for rendering claims

**Features**:
- Uses ClaimMachineryPicker for template selection
- Uses ClaimMachineryParameters for dynamic form
- Allows configuration of target path
- Creates GitLab merge request with rendered manifest
- Displays manifest in output

**Steps**:
1. Render claim manifest
2. Log manifest preview
3. Create GitLab merge request
4. Show summary

**Target Repository**: `codehub.sva.de/Lab/stuttgart-things/idp/resource-engines`

**Best For**: Testing and development

---

### `templates/claim-to-merge-request.yaml`

**Purpose**: Production-ready template for creating merge requests

**Features**:
- Clean, polished UI
- Comprehensive MR descriptions with collapsible sections
- Detailed output with next steps
- Professional formatting with emojis
- Better documentation in MR

**Differences from claim-template.yaml**:
- More detailed MR description
- Better output formatting
- Clearer user guidance
- Production-ready naming

**Best For**: Production use

## Documentation Files

### `README.md`

**Purpose**: Complete documentation for the plugin

**Contents**:
- Feature overview
- Installation instructions
- Usage examples
- API reference
- Troubleshooting guide
- Architecture diagram

---

### `QUICKSTART.md`

**Purpose**: Fast installation guide

**Contents**:
- Step-by-step installation (10 minutes)
- Quick verification steps
- Common troubleshooting
- Tips for getting started

---

### `docs/app-config.example.yaml`

**Purpose**: Example configuration snippets

**Contents**:
- Proxy configuration
- Catalog locations
- Backend configuration
- Environment variables
- GitLab integration

---

### `docs/FILE_STRUCTURE.md`

**Purpose**: This file - explains the plugin structure

---

### `docs/API.md`

**Purpose**: API documentation (to be created)

**Should Include**:
- Claim Machinery API endpoints
- Request/response formats
- Authentication
- Error codes

## Installation Targets

When installing in a Backstage instance, files should be copied to:

| Source | Target in Backstage |
|--------|---------------------|
| `backend/scaffolder-claim-machinery/` | `packages/backend/src/plugins/scaffolder-claim-machinery/` |
| `frontend/ClaimMachineryPicker/` | `packages/app/src/scaffolder/ClaimMachineryPicker/` |
| `templates/*.yaml` | `test-templates/` or your template directory |

## Dependencies

### Backend
- `@backstage/plugin-scaffolder-node` (core dependency)
- `fs-extra` (file operations)
- `node-fetch` (HTTP requests)
- `@backstage/types` (TypeScript types)

### Frontend
- `@backstage/plugin-scaffolder-react` (field extension framework)
- `@backstage/core-plugin-api` (Config API)
- `@material-ui/core` (UI components)
- `react` (core framework)

### Templates
- No additional dependencies
- Require GitLab integration for merge request functionality

## Customization Points

### Backend
- **API URL**: `action.ts` line 35
- **Timeout**: `action.ts` line 48 (default: 60s)
- **Output path**: Change default in schema

### Frontend
- **API endpoints**: Both extension files fetch from proxy
- **Validation**: Add custom validation in parameter handling
- **Styling**: Customize Material-UI components

### Templates
- **Repository**: Change `repoUrl` in merge request step
- **Branch naming**: Modify `branchName` template string
- **Target path**: Change `targetPath` default value

## Version Compatibility

- Backstage: v1.x
- Node.js: 18.x or higher
- React: 17.x or 18.x
- TypeScript: 4.x or 5.x

## File Sizes

Approximate file sizes:
- Backend action: ~5 KB
- Frontend components: ~20 KB total
- Templates: ~5 KB each
- Documentation: ~50 KB total

## Testing

Files that would need tests:
- `action.ts`: Unit tests for rendering logic
- `ClaimMachineryPickerExtension.tsx`: Component tests
- `ClaimMachineryParametersExtension.tsx`: Component tests
- Templates: E2E tests in Backstage

## Security Considerations

1. **API Access**: Proxy configured with `dangerously-allow-unauthenticated`
   - Consider adding authentication for production

2. **Input Validation**: Parameters are passed directly to API
   - Consider adding validation layer

3. **CORS**: Proxy handles CORS with `changeOrigin: true`
   - Review CORS settings for production

4. **Secrets**: No secrets in templates
   - GitLab token from environment variables only

## Performance

- **Template list fetch**: Once on component mount
- **Template details fetch**: Once per template selection
- **Manifest render**: On-demand via backend action
- **Caching**: None currently implemented (could be added)

## Future Enhancements

Potential improvements:
1. Add caching for template lists
2. Add authentication to proxy
3. Add parameter validation
4. Add retry logic for API calls
5. Add progress indicators
6. Add template search/filter
7. Add manifest preview before render
8. Add bulk operations
