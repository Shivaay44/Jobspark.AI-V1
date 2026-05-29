export function cleanResumeText(
  text: string
): string {
  let isJson = false;
  let parsed: any = null;
  let trimmedText = text.trim();

  // Strip Markdown code block wraps if present
  if (trimmedText.startsWith("```")) {
    const lines = trimmedText.split("\n");
    // Find first and last indices of backticks to extract content safely
    let firstBacktickIndex = 0;
    let lastBacktickIndex = lines.length - 1;
    
    if (lines[firstBacktickIndex].startsWith("```")) {
      firstBacktickIndex += 1;
    }
    if (lines[lastBacktickIndex] === "```") {
      lastBacktickIndex -= 1;
    }
    
    if (firstBacktickIndex <= lastBacktickIndex) {
      trimmedText = lines.slice(firstBacktickIndex, lastBacktickIndex + 1).join("\n").trim();
    }
  }

  try {
    parsed = JSON.parse(trimmedText);
    isJson = true;
  } catch (e) {
    // Not valid JSON
  }

  const cleanStringVal = (val: string): string => {
    return val
      // Remove markdown headings
      .replace(/#{1,6}\s?/g, "")

      // Remove bold markdown
      .replace(/\*\*/g, "")

      // Remove specific header lead-ins safely
      .replace(/^(Professional Summary|Executive Summary|Summary|Experience|Work Experience|Education|Skills):\s*/i, "")
      .replace(/^(Professional Summary|Executive Summary|Summary|Experience|Work Experience|Education|Skills)\s*\n/i, "")

      // Remove duplicate candidate names
      .replace(/Mohit Kumar/gi, "")

      // Normalize spaces
      .replace(/[ \t]+/g, " ")

      // Normalize line breaks
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  };

  if (isJson && parsed && typeof parsed === "object") {
    const cleanObject = (obj: any): any => {
      if (typeof obj === 'string') {
        return cleanStringVal(obj);
      } else if (Array.isArray(obj)) {
        return obj.map(item => cleanObject(item));
      } else if (obj !== null && typeof obj === 'object') {
        const cleaned: any = {};
        for (const key of Object.keys(obj)) {
          // Keep keys exactly as they are, only clean string values
          cleaned[key] = cleanObject(obj[key]);
        }
        return cleaned;
      }
      return obj;
    };

    const cleanedObj = cleanObject(parsed);
    return JSON.stringify(cleanedObj, null, 2);
  }

  // Fallback for markdown/plain text
  return text
    // Remove markdown headings
    .replace(/#{1,6}\s?/g, "")

    // Remove bold markdown
    .replace(/\*\*/g, "")

    // Remove duplicated titles safely (not inside JSON)
    .replace(/^(Professional Summary|Executive Summary|Summary):\s*/gm, "")
    .replace(/^(Professional Summary|Executive Summary|Summary)\s*$/gm, "")
    .replace(/\b(Professional Summary|Executive Summary|Summary)\b/gi, "")

    // Remove duplicate candidate names
    .replace(/Mohit Kumar/gi, "")

    // Normalize spaces
    .replace(/[ \t]+/g, " ")

    // Normalize line breaks
    .replace(/\n{3,}/g, "\n\n")

    .trim();
}

