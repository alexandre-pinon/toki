export const capitalize = (value: string): string => {
  if (value.length === 0) return "";

  return `${value[0].toUpperCase()}${value.slice(1)}`;
};

export const safeParseOptionalFloat = (value?: string): number | undefined => {
  if (!value) {
    return;
  }

  const float = parseFloat(value.replace(",", "."));

  if (Number.isNaN(float)) {
    return;
  }

  return float;
};

export const safeParseOptionalInt = (value?: string): number | undefined => {
  if (!value) {
    return;
  }

  const int = parseInt(value);

  if (Number.isNaN(int)) {
    return;
  }

  return int;
};

const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

export type TextSegment =
  | { type: "text"; content: string }
  | { type: "link"; content: string; url: string };

export const parseTextWithLinks = (text: string): TextSegment[] => {
  const segments: TextSegment[] = [];
  const matches = Array.from(text.matchAll(URL_REGEX));

  if (matches.length === 0) {
    return [{ type: "text", content: text }];
  }

  let lastIndex = 0;

  for (const match of matches) {
    const url = match[0];
    const startIndex = match.index!;

    // Add text before URL
    if (startIndex > lastIndex) {
      segments.push({
        type: "text",
        content: text.slice(lastIndex, startIndex),
      });
    }

    // Add URL segment
    segments.push({
      type: "link",
      content: url,
      url: url,
    });

    lastIndex = startIndex + url.length;
  }

  // Add remaining text after last URL
  if (lastIndex < text.length) {
    segments.push({
      type: "text",
      content: text.slice(lastIndex),
    });
  }

  return segments;
};
