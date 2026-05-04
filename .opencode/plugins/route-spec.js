import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const extractBody = (content) => {
  const match = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
  return match ? match[1] : content;
};

export const RouteSpecPlugin = async () => {
  const skillsDir = path.resolve(__dirname, '../../skills');

  const getBootstrapContent = () => {
    const skillPath = path.join(skillsDir, 'using-route-spec', 'SKILL.md');
    if (!fs.existsSync(skillPath)) return null;
    const content = fs.readFileSync(skillPath, 'utf8');
    const body = extractBody(content);
    return `<ROUTE_SPEC_IMPORTANT>
RouteSpec 工作流已加载。

**IMPORTANT: 以下内容已加载，无需再次使用 skill 工具加载 "using-route-spec"。**

${body}
</ROUTE_SPEC_IMPORTANT>`;
  };

  return {
    config: async (config) => {
      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];
      if (!config.skills.paths.includes(skillsDir)) {
        config.skills.paths.push(skillsDir);
      }
    },

    'experimental.chat.messages.transform': async (_input, output) => {
      const bootstrap = getBootstrapContent();
      if (!bootstrap || !output.messages.length) return;
      const firstUser = output.messages.find(m => m.info.role === 'user');
      if (!firstUser || !firstUser.parts.length) return;
      if (firstUser.parts.some(p => p.type === 'text' && p.text.includes('ROUTE_SPEC_IMPORTANT'))) return;
      const ref = firstUser.parts[0];
      firstUser.parts.unshift({ ...ref, type: 'text', text: bootstrap });
    },
  };
};
