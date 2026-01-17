# Backstage Claim Machinery Plugin - Index

Quick reference to all files and documentation.

## 🚀 START HERE

**New to this plugin?** → [DISTRIBUTION_SUMMARY.md](DISTRIBUTION_SUMMARY.md)

**Ready to install?** → [QUICKSTART.md](QUICKSTART.md)

**Need checklist?** → [INSTALLATION_CHECKLIST.md](INSTALLATION_CHECKLIST.md)

## 📚 Documentation (Start Here First)

| File | What It Is | When to Read |
|------|-----------|--------------|
| [DISTRIBUTION_SUMMARY.md](DISTRIBUTION_SUMMARY.md) | Overview of entire package | **Start here** - 5 min |
| [QUICKSTART.md](QUICKSTART.md) | Fast installation guide | Installing - 10 min |
| [INSTALLATION_CHECKLIST.md](INSTALLATION_CHECKLIST.md) | Step-by-step checklist | During install |
| [README.md](README.md) | Complete documentation | Reference - 15 min |
| [CHANGELOG.md](CHANGELOG.md) | Version history | Before updating |

## 🔧 Source Code

### Backend (Copy to: `packages/backend/src/plugins/`)
```
backend/scaffolder-claim-machinery/
├── action.ts        - Main scaffolder action
├── index.ts         - Exports
└── module.ts        - Backend module
```

### Frontend (Copy to: `packages/app/src/scaffolder/`)
```
frontend/ClaimMachineryPicker/
├── ClaimMachineryPickerExtension.tsx        - Template dropdown
├── ClaimMachineryParametersExtension.tsx    - Dynamic form
└── index.ts                                  - Exports
```

### Templates (Copy to your template directory)
```
templates/
├── claim-template.yaml            - Simple test template
└── claim-to-merge-request.yaml    - Production template
```

## 📖 Additional Documentation

| File | Purpose |
|------|---------|
| [docs/FILE_STRUCTURE.md](docs/FILE_STRUCTURE.md) | Detailed file documentation |
| [docs/app-config.example.yaml](docs/app-config.example.yaml) | Configuration examples |

## 🎯 Quick Navigation

### Installation Tasks
1. [Copy files](QUICKSTART.md#1-copy-files) → Backend, Frontend, Templates
2. [Install dependencies](QUICKSTART.md#2-install-dependencies) → yarn commands
3. [Register backend action](QUICKSTART.md#3-register-backend-action) → index.ts
4. [Create frontend index](QUICKSTART.md#4-create-frontend-field-extension-index) → index.ts with scaffolderPlugin.provide()
5. [Register frontend extensions](QUICKSTART.md#5-register-frontend-field-extensions) → App.tsx
6. [Add proxy](QUICKSTART.md#6-add-proxy-configuration) → app-config.yaml
7. [Add to catalog](QUICKSTART.md#7-add-templates-to-catalog) → templates
8. [Configure API URL](QUICKSTART.md#8-configure-api-url-optional) → action.ts (optional)
9. [Start Backstage](QUICKSTART.md#9-start-backstage) → yarn dev

### Troubleshooting
- [Empty dropdown?](README.md#dropdown-is-empty) → Check API URL and proxy
- [No field extensions?](README.md#field-extensions-not-showing-up) → Check registration
- [Action fails?](README.md#socket-hang-up-errors) → Check API connectivity

### Configuration
- [API URL](QUICKSTART.md#8-configure-api-url-optional) → action.ts line ~23
- [Proxy config](docs/app-config.example.yaml) → app-config.yaml
- [Environment vars](docs/app-config.example.yaml) → CLAIM_MACHINERY_API_URL
- [GitLab repo](README.md#change-target-repository) → templates

## 📦 File Sizes

| Component | Files | Size |
|-----------|-------|------|
| Backend | 3 files | ~5 KB |
| Frontend | 3 files | ~20 KB |
| Templates | 2 files | ~10 KB |
| Documentation | 8 files | ~80 KB |
| **Total** | **16 files** | **~116 KB** |

## 🏃 Installation Time

| Step | Time | Done? |
|------|------|-------|
| Read DISTRIBUTION_SUMMARY | 5 min | ☐ |
| Copy files | 2 min | ☐ |
| Install dependencies | 1 min | ☐ |
| Configure | 5 min | ☐ |
| Register components | 2 min | ☐ |
| Start & verify | 2 min | ☐ |
| **Total** | **~17 min** | |

## 🎓 Learning Path

```
1. DISTRIBUTION_SUMMARY.md  ← Overview (5 min)
       ↓
2. QUICKSTART.md           ← Install (10 min)
       ↓
3. Test in Backstage       ← Verify (5 min)
       ↓
4. README.md              ← Deep dive (15 min)
       ↓
5. FILE_STRUCTURE.md      ← Understand (10 min)
       ↓
6. Customize templates     ← Adapt (30 min)
```

## 🔗 External Links

- [Backstage Documentation](https://backstage.io/docs)
- [Scaffolder Actions](https://backstage.io/docs/features/software-templates/builtin-actions)
- [Custom Field Extensions](https://backstage.io/docs/features/software-templates/writing-custom-field-extensions)

## 📝 Checklist Progress

Track your installation:
- ☐ Read overview documentation
- ☐ Copied backend files
- ☐ Copied frontend files
- ☐ Copied templates
- ☐ Installed dependencies
- ☐ Configured API URL
- ☐ Added proxy config
- ☐ Registered field extensions
- ☐ Registered backend action
- ☐ Added to catalog
- ☐ Set environment variables
- ☐ Started Backstage
- ☐ Verified dropdown works
- ☐ Verified parameters work
- ☐ Created test claim
- ☐ Created merge request

## 🆘 Need Help?

1. **Installation issues** → [INSTALLATION_CHECKLIST.md](INSTALLATION_CHECKLIST.md)
2. **Configuration** → [docs/app-config.example.yaml](docs/app-config.example.yaml)
3. **Understanding files** → [docs/FILE_STRUCTURE.md](docs/FILE_STRUCTURE.md)
4. **Troubleshooting** → [README.md#troubleshooting](README.md#troubleshooting)
5. **API reference** → [README.md#api-reference](README.md#api-reference)

## 🎯 Success Indicators

✅ Installation successful when:
- Claim template dropdown is populated
- Parameters form appears on selection
- Templates render without errors
- Manifests are generated
- (Optional) Merge requests are created

---

**Version**: 1.0.0 | **Date**: 2026-01-14 | **Status**: Ready for distribution
