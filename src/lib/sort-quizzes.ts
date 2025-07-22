export function parseDate(
  dateStr: string | number | Date | null | undefined
): number {
  if (!dateStr || dateStr === "Not taken") return 0;

  if (typeof dateStr === "string") {
    // Если формат "дд.мм.гггг"
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split(".");
      return new Date(+year, +month - 1, +day).getTime();
    }
    // Если ISO-строка
    const parsed = Date.parse(dateStr);
    if (!isNaN(parsed)) return parsed;
  }

  // Если это Date или число
  const dateObj = new Date(dateStr as any);
  if (!isNaN(dateObj.getTime())) return dateObj.getTime();

  return 0;
}

export function sortQuizzes(
  a: any,
  b: any,
  sortField: string,
  sortOrder: "asc" | "desc"
) {
  let aValue = a[sortField];
  let bValue = b[sortField];

  if (sortField === "createdAt") {
    const aDate = parseDate(aValue);
    const bDate = parseDate(bValue);
    if (aDate === 0 && bDate === 0) return 0;
    if (aDate === 0) return 1;
    if (bDate === 0) return -1;
    return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
  }

  if (sortField === "score") {
    const isANull =
      aValue === null || aValue === undefined || aValue === "Not taken";
    const isBNull =
      bValue === null || bValue === undefined || bValue === "Not taken";
    if (isANull && isBNull) return 0;
    if (isANull) return 1;
    if (isBNull) return -1;
    const aNum = Number(aValue);
    const bNum = Number(bValue);
    return sortOrder === "asc" ? aNum - bNum : bNum - aNum;
  }

  if (typeof aValue === "string" && typeof bValue === "string") {
    const cmp = aValue.localeCompare(bValue);
    return sortOrder === "asc" ? cmp : -cmp;
  }

  const aNum = Number(aValue);
  const bNum = Number(bValue);
  return sortOrder === "asc" ? aNum - bNum : bNum - aNum;
}
