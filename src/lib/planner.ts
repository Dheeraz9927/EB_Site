import { checklists, isCoverageKey, type CoverageKey } from '../data/coverage.ts';
export function normalizeSelection(values: string[]): CoverageKey[] {
  return [...new Set(values.filter(isCoverageKey))];
}
/** Id for one checklist item, e.g. "auto-0". Shared by the planner UI and the email draft. */
export function checklistItemId(key: CoverageKey, index: number): string { return `${key}-${index}`; }
/**
 * Builds a mailto: link that opens a draft in the visitor's own email app. Nothing is sent automatically.
 * Ticked items (ids from checklistItemId) are listed under their topic as things the visitor has ready.
 */
export function createEmailDraft(values: string[], email: string, ticked: Iterable<string> = []): string {
  const keys = normalizeSelection(values);
  const ready = new Set(ticked);
  const topics = keys.map(key => checklists[key].title);
  const subject = topics.length ? `Coverage conversation: ${topics.join(', ')}` : 'Coverage conversation';
  const sections = keys.flatMap(key => {
    const done = checklists[key].items.filter((_, index) => ready.has(checklistItemId(key, index)));
    return [
      `- ${checklists[key].title}`,
      ...(done.length ? ['  I already have ready:', ...done.map(item => `  ✓ ${item}`)] : []),
    ];
  });
  const body = [
    'Hi Elaena team,',
    '',
    topics.length ? 'I’d like to talk about:' : 'I’d like to talk about my insurance.',
    ...sections,
    '',
    'The best time to reach me is: ',
    'My phone number is: ',
    '',
    '(Please don’t include driver’s licence, banking or payment details.)',
  ].join('\n');
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
export function readinessSummary(done: number, total: number): string {
  if (total < 1) return '';
  if (done >= total) return `All ${total} ready. You’re set for a great conversation.`;
  return `${done} of ${total} ready`;
}
export function nextTabIndex(key: string, current: number, count: number): number | null {
  if (count < 1) return null;
  switch (key) {
    case 'ArrowRight': return (current + 1) % count;
    case 'ArrowLeft': return (current + count - 1) % count;
    case 'Home': return 0;
    case 'End': return count - 1;
    default: return null;
  }
}
