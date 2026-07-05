import type { QueryResponse } from '@/entities/query/model/types';
import { formatGeoLabel } from '@/shared/lib/formatDomainLabels';

export const buildAnswerMarkdown = (response: QueryResponse, queryText: string): string => {
  const lines: string[] = [
    `# Ответ по запросу`,
    '',
    queryText,
    '',
    response.answer_md,
    '',
    `**Достоверность:** ${Math.round(response.confidence * 100)}%`,
    '',
  ];

  if (response.groups.length > 0) {
    lines.push('## Группы источников', '');
    for (const group of response.groups) {
      lines.push(`### ${group.title}`, '', group.summary, '');
      const entries = group.entries?.length
        ? group.entries
        : group.source_titles.map((title) => ({
            title,
            document_id: null,
            excerpt: '',
            page_label: null,
          }));
      for (const entry of entries) {
        const page = entry.page_label ? ` — ${entry.page_label}` : '';
        lines.push(`- **${entry.title}**${page}`);
        if (entry.excerpt) {
          lines.push(`  > ${entry.excerpt}`);
        }
      }
      lines.push('');
    }
  }

  if (response.gaps.length > 0) {
    lines.push('## Пробелы в знаниях', '');
    for (const gap of response.gaps) {
      lines.push(`- ${gap}`);
    }
    lines.push('');
  }

  if (response.recommendations.length > 0) {
    lines.push('## Рекомендации', '');
    for (const item of response.recommendations) {
      lines.push(`- ${item}`);
    }
    lines.push('');
  }

  if (response.related.experts.length > 0 || response.related.facilities.length > 0) {
    lines.push('## Эксперты и площадки', '');
    for (const expert of response.related.experts) {
      lines.push(`- Эксперт: ${expert}`);
    }
    for (const facility of response.related.facilities) {
      lines.push(`- Площадка: ${facility}`);
    }
    lines.push('');
  }

  if (response.sources.length > 0) {
    lines.push('## Источники', '');
    for (const source of response.sources) {
      const meta = [
        source.geo ? formatGeoLabel(source.geo) : null,
        source.year?.toString(),
        source.page_label ?? (source.page_num ? `стр. ${source.page_num}` : null),
      ]
        .filter(Boolean)
        .join(' · ');
      lines.push(`- **${source.title}**${meta ? ` (${meta})` : ''}`);
      lines.push(`  > ${source.chunk_text.slice(0, 400)}`);
    }
    lines.push('');
  }

  if (response.contradictions.length > 0) {
    lines.push('## Расхождения', '');
    for (const item of response.contradictions) {
      lines.push(`- ${item.topic}: ${item.summary}`);
    }
  }

  return lines.join('\n');
};

export const downloadAnswerMarkdown = (response: QueryResponse, queryText: string): void => {
  const content = buildAnswerMarkdown(response, queryText);
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `answer-${response.query_id.slice(0, 8)}.md`;
  link.click();
  URL.revokeObjectURL(url);
};
