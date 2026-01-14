import { createBackendModule } from '@backstage/backend-plugin-api';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import { claimMachineryRenderAction } from './action';

export const scaffolderClaimMachineryModule = createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'claim-machinery',

  register(env) {
    env.registerInit({
      deps: {
        scaffolderActions: scaffolderActionsExtensionPoint,
      },
      async init({ scaffolderActions }) {
        scaffolderActions.addActions(
          claimMachineryRenderAction,
        );
      },
    });
  },
});
