import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import fs from 'fs-extra';
import fetch from 'node-fetch';
import path from 'path';

export const claimMachineryRenderAction = () => createTemplateAction({
  id: 'claim-machinery:render',
  description: 'Render a Claim Machinery template into workspace files',

  schema: {
    input: {
      template: z => z.string().describe('The name of the Claim Machinery template'),
      parameters: z => z.record(z.any()).optional().describe('Template parameters'),
      outputPath: z => z.string().optional().default('.').describe('Output path for the rendered file'),
    },
    output: {
      manifest: z => z.string().describe('The rendered manifest content'),
      filePath: z => z.string().describe('The path to the rendered file'),
    },
  },

  async handler(ctx) {
    const baseUrl = 'http://sthings-backstage.tiab.labda.sva.de:8080';

    ctx.logger.info(`Rendering template: ${ctx.input.template}`);
    ctx.logger.info(`Parameters: ${JSON.stringify(ctx.input.parameters)}`);

    const requestBody = { parameters: ctx.input.parameters || {} };
    const url = `${baseUrl}/api/v1/claim-templates/${ctx.input.template}/order`;

    ctx.logger.info(`POST ${url}`);
    ctx.logger.info(`Request body: ${JSON.stringify(requestBody)}`);

    // Use AbortController for timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      ctx.logger.info(`Response status: ${res.status}`);

      if (!res.ok) {
        const errorText = await res.text();
        ctx.logger.error(`API error: ${errorText}`);
        throw new Error(`API returned ${res.status}: ${errorText}`);
      }

      const response = (await res.json()) as { rendered: string };

      ctx.logger.info('Template rendered successfully!');
      ctx.logger.info(`Manifest preview:\n${response.rendered.substring(0, 200)}...`);

      const targetDir = path.join(
        ctx.workspacePath,
        ctx.input.outputPath ?? '.',
      );

      await fs.ensureDir(targetDir);

      const fileName = `${ctx.input.template}.yaml`;
      const filePath = path.join(targetDir, fileName);

      await fs.writeFile(filePath, response.rendered);

      ctx.logger.info(`Manifest written to: ${fileName}`);

      // Make the manifest available to subsequent steps
      ctx.output('manifest', response.rendered);
      ctx.output('filePath', fileName);
    } catch (err) {
      clearTimeout(timeout);
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('Request timed out after 60 seconds');
      }
      throw err;
    }
  },
});
