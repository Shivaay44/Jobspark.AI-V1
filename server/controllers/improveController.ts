import { Request, Response } from "express";
import { generateImprovedSection } from "../services/aiService";

export async function improveSection(
  req: Request,
  res: Response
) {
  try {
    const {
      section,
      content,
    } = req.body;

    if (!section || !content) {
      return res.status(400).json({
        error:
          "Section and content required",
      });
    }

    const improvedText = await generateImprovedSection(section, content);
    return res.json({
      improved: improvedText,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error:
        "Failed to improve content",
    });
  }
}
