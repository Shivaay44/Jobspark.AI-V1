import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 36,
    fontFamily: "Helvetica",
  },

  headerContainer: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },

  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 18, // IMPORTANT
    letterSpacing: 0.3,
  },

  role: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 14, // IMPORTANT
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  contactContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  contactItem: {
    fontSize: 10,
    color: "#6B7280",
  },

  section: {
    marginTop: 14,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    marginTop: 18,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  paragraph: {
    fontSize: 10,
    lineHeight: 1.6,
  },

  summary: {
    fontSize: 11,
    lineHeight: 1.8,
    color: "#374151",
    marginBottom: 14,
  },

  experienceBlock: {
    marginBottom: 10,
  },

  subHeader: {
    fontSize: 11,
    fontWeight: 'bold',
  },

  company: {
    fontSize: 10,
    color: '#374151',
  },

  date: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 4,
  },

  bullet: {
    marginLeft: 10,
    fontSize: 11,
    lineHeight: 1.7,
    marginBottom: 6,
  },

  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  skill: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginRight: 5,
    marginBottom: 5,
    fontSize: 9,
  },
});

function cleanResumeText(text: string): string {
  if (!text) return "";
  return text
    // Remove markdown headings
    .replace(/#{1,6}\s?/g, "")

    // Remove bold markdown
    .replace(/\*\*/g, "")

    // Remove duplicated titles
    .replace(/Professional Summary/gi, "")
    .replace(/Executive Summary/gi, "")
    .replace(/Summary/gi, "")

    // Normalize spaces
    .replace(/[ \t]+/g, " ")

    // Normalize line breaks
    .replace(/\n{3,}/g, "\n\n")

    .trim();
}

function safeText(text?: string): string {
  if (!text) return "";
  return text
    .trim()
    .slice(0, 1500);
}

interface ResumePDFProps {
  data: any;
}

export default function ResumePDF({ data: rawData }: ResumePDFProps) {
  const data = {
    ...rawData,
    name: rawData?.personalInfo?.fullName || rawData?.name || "Your Name",
    role: rawData?.personalInfo?.headline || rawData?.role || "Professional",
    email: rawData?.personalInfo?.email || rawData?.email || "",
    phone: rawData?.personalInfo?.phone || rawData?.phone || "",
    location: rawData?.personalInfo?.location || rawData?.location || "",
    linkedin: rawData?.personalInfo?.linkedin || rawData?.linkedin || "",
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          {/* NAME */}
          <Text style={styles.name}>
            {data.name}
          </Text>

          {/* ROLE */}
          <Text style={styles.role}>
            {data.role}
          </Text>

          {/* CONTACT INFO */}
          <View style={styles.contactContainer}>
            <Text style={styles.contactItem}>
              {data.email}
            </Text>

            <Text style={styles.contactItem}>
              {data.phone}
            </Text>

            <Text style={styles.contactItem}>
              {data.location}
            </Text>

            <Text style={styles.contactItem}>
              {data.linkedin}
            </Text>
          </View>
        </View>

        {/* Summary */}
        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Professional Summary
            </Text>
            <Text style={styles.summary}>
              {safeText(cleanResumeText(data.summary))}
            </Text>
          </View>
        )}

        {/* Experience */}
        {data.experience?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Experience
            </Text>
            {data.experience.map((job: any, index: number) => (
              <View key={index} style={styles.experienceBlock}>
                <Text style={styles.subHeader}>
                  {job.role}
                </Text>

                <Text style={styles.company}>
                  {job.company}
                </Text>

                <Text style={styles.date}>
                  {job.startDate && job.endDate ? `${job.startDate} - ${job.endDate}` : (job.startDate || job.endDate || '')}
                </Text>

                {job.achievements?.map((bullet: string, i: number) => (
                  <Text key={i} style={styles.bullet}>
                    • {bullet}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Education
            </Text>
            {data.education.map((edu: any, index: number) => (
              <View key={index} style={styles.experienceBlock}>
                <Text style={styles.subHeader}>
                  {edu.degree}
                </Text>

                <Text style={styles.company}>
                  {edu.school}
                </Text>

                <Text style={styles.date}>
                  {edu.year}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Skills
            </Text>
            <View style={styles.skillsContainer}>
              {data.skills.map((skill: string, index: number) => (
                <Text key={index} style={styles.skill}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Projects */}
        {data.projects?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Projects
            </Text>
            {data.projects.map((project: any, index: number) => (
              <View key={index} style={styles.experienceBlock}>
                <Text style={styles.subHeader}>
                  {project.name}
                </Text>
                {project.link && (
                  <Text style={{ fontSize: 9, color: '#1e40af', marginBottom: 4 }}>
                    {project.link}
                  </Text>
                )}
                {project.technologies?.length > 0 && (
                  <Text style={{ fontSize: 9, color: '#475569', fontStyle: 'italic', marginBottom: 2 }}>
                    Technologies: {project.technologies.join(', ')}
                  </Text>
                )}
                {project.achievements?.map((bullet: string, i: number) => (
                  <Text key={i} style={styles.bullet}>
                    • {bullet}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}

