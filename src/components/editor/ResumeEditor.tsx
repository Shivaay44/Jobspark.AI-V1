import { useState } from "react";
import { improveSection } from "../../services/ai";

interface ResumeData {
  summary: string;
  experience: string;
  skills: string;
  education: string;
}

interface Props {
  initialData: ResumeData;
  onSave: (data: ResumeData) => void;
}

export default function ResumeEditor({
  initialData,
  onSave,
}: Props) {
  const [data, setData] =
    useState(initialData);
  const [improving, setImproving] = useState(false);

  function updateField(
    field: keyof ResumeData,
    value: string
  ) {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleImproveSummary() {
    if (!data.summary.trim()) return;
    setImproving(true);
    try {
      const result = await improveSection("summary", data.summary);
      if (result && result.improved) {
        updateField("summary", result.improved.trim());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setImproving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* SUMMARY */}
      <div>
        <label className="mb-2 block text-sm font-semibold">
          Professional Summary
        </label>

        <textarea
          value={data.summary}
          onChange={(e) =>
            updateField(
              "summary",
              e.target.value
            )
          }
          className="
            min-h-[160px]
            w-full
            rounded-xl
            border
            p-4
            text-sm
          "
        />

        <button
          onClick={handleImproveSummary}
          disabled={improving || !data.summary.trim()}
          className="
            mt-2
            rounded-lg
            border
            px-3
            py-2
            text-sm
            disabled:opacity-50
            hover:bg-slate-50
            transition-colors
          "
        >
          {improving ? "Improving..." : "Improve Summary"}
        </button>
      </div>

      {/* EXPERIENCE */}
      <div>
        <label className="mb-2 block text-sm font-semibold">
          Experience
        </label>

        <textarea
          value={data.experience}
          onChange={(e) =>
            updateField(
              "experience",
              e.target.value
            )
          }
          className="
            min-h-[220px]
            w-full
            rounded-xl
            border
            p-4
            text-sm
          "
        />
      </div>

      {/* SKILLS */}
      <div>
        <label className="mb-2 block text-sm font-semibold">
          Skills
        </label>

        <textarea
          value={data.skills}
          onChange={(e) =>
            updateField(
              "skills",
              e.target.value
            )
          }
          className="
            min-h-[120px]
            w-full
            rounded-xl
            border
            p-4
            text-sm
          "
        />
      </div>

      {/* EDUCATION */}
      <div>
        <label className="mb-2 block text-sm font-semibold">
          Education
        </label>

        <textarea
          value={data.education}
          onChange={(e) =>
            updateField(
              "education",
              e.target.value
            )
          }
          className="
            min-h-[120px]
            w-full
            rounded-xl
            border
            p-4
            text-sm
          "
        />
      </div>

      <button
        onClick={() => onSave(data)}
        className="
          rounded-xl
          bg-black
          px-5
          py-3
          text-white
        "
      >
        Save Changes
      </button>
    </div>
  );
}
