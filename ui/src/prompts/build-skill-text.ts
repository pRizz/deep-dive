import { GeneratedSkillText, PromptCardDefinition } from './types';

function toNumberedList(items: string[]): string[] {
  return items.map((item, index) => `${index + 1}. ${item}`);
}

function joinNonEmpty(parts: string[]): string {
  return parts
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .join(' ');
}

export function toSkillSlug(promptCard: PromptCardDefinition): string {
  const normalized = promptCard.id
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return normalized || 'skill';
}

export function buildCodexSkillMarkdown(promptCard: PromptCardDefinition): string {
  const skillName = toSkillSlug(promptCard);
  const skillDescription = promptCard.teaser.trim() || promptCard.title.trim();
  const usageContext = joinNonEmpty([promptCard.teaser, promptCard.expectedImpact]);

  return [
    '---',
    `name: ${skillName}`,
    `description: ${JSON.stringify(skillDescription)}`,
    '---',
    '',
    `# ${promptCard.title}`,
    '',
    '## Use this when',
    promptCard.useWhen,
    '',
    '## How to use',
    usageContext,
    '',
    '### Required inputs',
    ...toNumberedList(promptCard.prompt.requiredInputs),
    '',
    '### Steps',
    ...toNumberedList(promptCard.prompt.tasks),
    '',
    '### Constraints',
    ...toNumberedList(promptCard.prompt.constraints),
    '',
    '### Expected output',
    ...toNumberedList(promptCard.prompt.outputFormat),
  ].join('\n');
}

export function buildGenericSkillMarkdown(promptCard: PromptCardDefinition): string {
  return [
    `# ${promptCard.title}`,
    '',
    '## Context',
    `${promptCard.teaser} ${promptCard.useWhen}`,
    '',
    '## Objective',
    promptCard.prompt.objective,
    '',
    '## Inputs',
    ...toNumberedList(promptCard.prompt.requiredInputs),
    '',
    '## Instructions',
    ...toNumberedList(promptCard.prompt.tasks),
    '',
    '## Constraints',
    ...toNumberedList(promptCard.prompt.constraints),
    '',
    '## Response format',
    ...toNumberedList(promptCard.prompt.outputFormat),
  ].join('\n');
}

export function buildSkillText(promptCard: PromptCardDefinition): GeneratedSkillText {
  return {
    codexSkillMarkdown: buildCodexSkillMarkdown(promptCard),
    genericSkillMarkdown: buildGenericSkillMarkdown(promptCard),
  };
}
