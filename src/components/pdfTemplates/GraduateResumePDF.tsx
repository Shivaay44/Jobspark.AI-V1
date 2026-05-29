import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 40,
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    lineHeight: 1.4,
    color: '#334155',
  },
  topAccentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#10b981', // emerald-500 equivalent
  },
  header: {
    textAlign: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 12,
    marginBottom: 12,
    marginTop: 8,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  headline: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#059669', // emerald-600 equivalent
    marginTop: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  contactBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    fontSize: 8,
    color: '#64748b',
    marginTop: 6,
    gap: 6,
  },
  contactItem: {
    fontSize: 8,
    color: '#64748b',
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#059669',
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#a7f3d0', // emerald-200 equivalent
    paddingBottom: 2,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.4,
  },
  eduBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  eduLeft: {
    flex: 1,
  },
  eduDegree: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  eduSchool: {
    fontSize: 8.5,
    color: '#475569',
    marginTop: 1,
  },
  eduYear: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#059669',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  experienceBlock: {
    position: 'relative',
    paddingLeft: 8,
    borderLeftWidth: 1.5,
    borderLeftColor: '#cbd5e1',
    marginBottom: 8,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  jobRole: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  jobCompany: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#059669',
    marginTop: 1,
  },
  jobDate: {
    fontSize: 8,
    color: '#64748b',
  },
  bulletList: {
    marginTop: 4,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bulletSign: {
    width: 6,
    fontSize: 8,
    color: '#059669',
  },
  bulletText: {
    flex: 1,
    fontSize: 8.5,
    color: '#475569',
    lineHeight: 1.35,
  },
  skillsListBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  skillCell: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 8,
    color: '#334155',
  },
  projectBlock: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#e2e8f0',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  projectNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  projectName: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  projectLink: {
    fontSize: 8,
    color: '#059669',
  },
  techBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    marginTop: 2,
    marginBottom: 4,
  },
  techBadgeText: {
    fontSize: 7.5,
    color: '#059669',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
});

interface ResumePDFProps {
  data: any;
}

export default function GraduateResumePDF({ data }: ResumePDFProps) {
  const { personalInfo, summary, experience, education, skills, projects } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Top Accent Bar */}
        <View style={styles.topAccentBar} />

        {/* Centered Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo?.fullName || 'Your Name'}</Text>
          {personalInfo?.headline && <Text style={styles.headline}>{personalInfo.headline}</Text>}
          
          <View style={styles.contactBox}>
            {personalInfo?.email && <Text style={styles.contactItem}>{personalInfo.email}</Text>}
            {personalInfo?.phone && (
              <>
                <Text style={{ color: '#cbd5e1' }}>|</Text>
                <Text style={styles.contactItem}>{personalInfo.phone}</Text>
              </>
            )}
            {personalInfo?.location && (
              <>
                <Text style={{ color: '#cbd5e1' }}>|</Text>
                <Text style={styles.contactItem}>{personalInfo.location}</Text>
              </>
            )}
            {personalInfo?.linkedin && (
              <>
                <Text style={{ color: '#cbd5e1' }}>|</Text>
                <Text style={styles.contactItem}>
                  {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
                </Text>
              </>
            )}
            {personalInfo?.portfolio && (
              <>
                <Text style={{ color: '#cbd5e1' }}>|</Text>
                <Text style={styles.contactItem}>
                  {personalInfo.portfolio.replace(/^https?:\/\/(www\.)?/, '')}
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Summary (Carrier Objective) */}
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Career Objective</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        )}

        {/* Education (Placed first for Graduates/Students!) */}
        {education && education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu: any, idx: number) => (
              <View key={idx} style={styles.eduBlock} wrap={false}>
                <View style={styles.eduLeft}>
                  <Text style={styles.eduDegree}>{edu.degree || 'Degree'}</Text>
                  <Text style={styles.eduSchool}>{edu.school || 'School'}</Text>
                </View>
                <Text style={styles.eduYear}>{edu.year || 'Year'}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Experience / Internships */}
        {experience && experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience & Internships</Text>
            {experience.map((job: any, idx: number) => (
              <View key={idx} style={styles.experienceBlock} wrap={false}>
                <View style={styles.jobHeader}>
                  <Text style={styles.jobRole}>{job.role}</Text>
                  <Text style={styles.jobDate}>
                    {job.startDate && job.endDate ? `${job.startDate} - ${job.endDate}` : (job.startDate || job.endDate || '')}
                  </Text>
                </View>
                <Text style={styles.jobCompany}>{job.company}</Text>
                {job.achievements && job.achievements.length > 0 && (
                  <View style={styles.bulletList}>
                    {job.achievements.map((bullet: string, i: number) => (
                      <View key={i} style={styles.bulletItem}>
                        <Text style={styles.bulletSign}>•</Text>
                        <Text style={styles.bulletText}>{bullet}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills & Competencies */}
        {skills && skills.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Skills & Competencies</Text>
            <View style={styles.skillsListBox}>
              {skills.map((skill: string, idx: number) => (
                <Text key={idx} style={styles.skillCell}>{skill}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Academic & Personal Projects</Text>
            {projects.map((project: any, idx: number) => (
              <View key={idx} style={styles.projectBlock} wrap={false}>
                <View style={styles.projectNameRow}>
                  <Text style={styles.projectName}>{project.name}</Text>
                  {project.link && (
                    <Text style={styles.projectLink}>
                      {project.link.replace(/^https?:\/\/(www\.)?/, '')}
                    </Text>
                  )}
                </View>
                {project.technologies && project.technologies.length > 0 && (
                  <View style={styles.techBadges}>
                    {project.technologies.map((tech: string, techIdx: number) => (
                      <Text key={techIdx} style={styles.techBadgeText}>{tech}</Text>
                    ))}
                  </View>
                )}
                {project.achievements && project.achievements.length > 0 && (
                  <View style={styles.bulletList}>
                    {project.achievements.map((bullet: string, i: number) => (
                      <View key={i} style={styles.bulletItem}>
                        <Text style={styles.bulletSign}>•</Text>
                        <Text style={styles.bulletText}>{bullet}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
