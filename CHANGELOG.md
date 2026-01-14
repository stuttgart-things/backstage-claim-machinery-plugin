# Changelog

All notable changes to the Backstage Claim Machinery Plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-14

### Added

#### Backend
- **Custom Scaffolder Action**: `claim-machinery:render`
  - Renders claim templates via Claim Machinery API
  - Supports parameter passing to templates
  - Outputs manifest content for use in subsequent steps
  - Includes 60-second timeout with AbortController
  - Comprehensive error handling and logging
  - Saves rendered manifests to workspace

#### Frontend
- **ClaimMachineryPicker Field Extension**
  - Dropdown selector for claim templates
  - Fetches templates from API dynamically
  - Displays template metadata (title, description, tags)
  - Shows required parameters preview
  - Loading and error state handling
  - Uses Backstage Config API for backend URL discovery

- **ClaimMachineryParameters Field Extension**
  - Dynamic form generation based on template schema
  - Supports multiple parameter types:
    - String with pattern/length validation
    - Boolean (checkbox)
    - Enum (dropdown)
    - Array (comma-separated input)
  - Auto-initialization with default values
  - Real-time form context watching
  - Help text and descriptions for all fields

#### Templates
- **claim-template.yaml**: Simple test template
  - Demonstrates basic claim rendering
  - Shows manifest in logs and output
  - Creates GitLab merge request
  - Configurable target path

- **claim-to-merge-request.yaml**: Production template
  - Clean, professional UI
  - Comprehensive MR descriptions
  - Collapsible manifest preview in GitLab
  - Detailed output with next steps
  - Links to MR and repository

#### Documentation
- **README.md**: Complete plugin documentation
  - Installation instructions
  - Usage examples
  - API reference
  - Architecture diagram
  - Troubleshooting guide

- **QUICKSTART.md**: 10-minute installation guide
  - Step-by-step instructions
  - Verification steps
  - Common issues and solutions

- **docs/FILE_STRUCTURE.md**: File organization guide
- **docs/app-config.example.yaml**: Configuration examples

#### Configuration
- Proxy configuration for Claim Machinery API
- Field extension registration in Backstage API factory
- Catalog locations for templates
- GitLab integration support

### Technical Details

#### Dependencies
- `@backstage/plugin-scaffolder-node` ^0.4.0
- `@backstage/plugin-scaffolder-react` ^1.19.0
- `@backstage/core-plugin-api` ^1.9.0
- `@backstage/types` ^1.1.0
- `@material-ui/core` ^4.12.0
- `fs-extra` ^11.0.0
- `node-fetch` ^2.6.0

#### API Endpoints Used
- `GET /api/v1/claim-templates` - List available templates
- `GET /api/v1/claim-templates/{name}` - Get template details
- `POST /api/v1/claim-templates/{name}/order` - Render template

#### Features
- ✅ Dynamic template discovery
- ✅ Type-safe parameter handling
- ✅ GitLab merge request creation
- ✅ Manifest output in multiple formats
- ✅ Comprehensive error handling
- ✅ Timeout protection
- ✅ CORS handling via proxy
- ✅ Material-UI integration
- ✅ Real-time form validation

### Known Issues
- None at release

### Breaking Changes
- None (initial release)

## [Unreleased]

### Planned Features
- [ ] Template caching for better performance
- [ ] Authentication support for API calls
- [ ] Parameter validation middleware
- [ ] Retry logic for API failures
- [ ] Bulk template operations
- [ ] Template search and filtering
- [ ] Manifest preview before rendering
- [ ] Custom parameter widgets
- [ ] Template versioning support
- [ ] Metrics and analytics

### Potential Improvements
- [ ] Add unit tests for backend action
- [ ] Add component tests for field extensions
- [ ] Add E2E tests for templates
- [ ] Add Storybook stories for components
- [ ] Add OpenAPI spec for API documentation
- [ ] Add TypeScript strict mode
- [ ] Add ESLint rules
- [ ] Add Prettier configuration
- [ ] Add GitHub Actions for CI/CD
- [ ] Add Docker support for development

## Version History

- **1.0.0** (2026-01-14): Initial release with core functionality

---

## How to Upgrade

Since this is the initial release, no upgrade instructions are needed yet.

Future versions will include:
- Migration guides
- Breaking change notifications
- Deprecation warnings
- Upgrade scripts

## Support

For issues, questions, or contributions:
- GitHub Issues: [Report a bug](https://github.com/stuttgart-things/backstage-claim-machinery-plugin/issues)
- Documentation: See [README.md](README.md)
- Quick Start: See [QUICKSTART.md](QUICKSTART.md)

## Contributors

- Patrick Hermann (initial implementation)
- Stuttgart Things Platform Team

## License

Apache-2.0 - See LICENSE file for details
