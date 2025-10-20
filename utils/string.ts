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
