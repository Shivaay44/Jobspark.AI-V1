import { ResumeData, PersonalInfo } from '../../types';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export function PersonalInfoStep({ data, onChange }: Props) {
  const info = data.personalInfo;
  const fields: (keyof PersonalInfo)[] = [
    'fullName',
    'email',
    'phone',
    'location',
    'linkedin',
    'portfolio',
  ];

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-white">Personal Information</h3>
        <p className="text-slate-400 text-sm">How can employers contact you?</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {fields.map((field) => (
          <div key={field} className="space-y-2">
            <label htmlFor={`field-${field}`} className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {field.replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              id={`field-${field}`}
              type={field === 'email' ? 'email' : 'text'}
              value={info[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={`Your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 focus:ring-2 focus:ring-indigo-500/50 transition-all text-white placeholder:text-slate-600 outline-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
