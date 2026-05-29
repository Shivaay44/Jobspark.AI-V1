import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 30,
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    lineHeight: 1.4,
    color: '#1e293b',
  },
  topAccentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#4f46e5',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 16,
    marginBottom: 16,
    marginTop: 10,
  },
  headerLeft: {
    flex: 1,
    paddingRight: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  headline: {
    fontSize: 11,
    fontWeight: 'medium',
    color: '#4f46e5',
    marginTop: 18,
  },
  headerRightBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 8,
    minWidth: 190,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  contactDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4f46e5',
    marginRight: 6,
  },
  contactText: {
    fontSize: 8,
    color: '#475569',
  },
  columnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftColumn: {
    width: '62%',
  },
  rightColumn: {
    width: '34%',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionIndicator: {
    width: 3,
    height: 12,
    backgroundColor: '#4f46e5',
    borderRadius: 1.5,
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.4,
  },
  experienceBlock: {
    position: 'relative',
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: '#f1f5f9',
    marginBottom: 10,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  jobRole: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  jobCompany: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#4f46e5',
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
    marginBottom: 2.5,
  },
  bulletSign: {
    width: 6,
    fontSize: 8,
    color: '#64748b',
  },
  bulletText: {
    flex: 1,
    fontSize: 8.5,
    color: '#475569',
    lineHeight: 1.35,
  },
  skillsPanel: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    padding: 10,
    marginBottom: 14,
  },
  skillsTitle: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#0f172a',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  skillPill: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  skillText: {
    fontSize: 7.5,
    color: '#334155',
    fontWeight: 'medium',
  },
  eduBlock: {
    marginBottom: 8,
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
    color: '#4f46e5',
    fontWeight: 'medium',
    marginTop: 1,
  },
});

interface ResumePDFProps {
  data: any;
}

export default function ModernResumePDF({ data }: ResumePDFProps) {
  const { personalInfo, summary, experience, education, skills, projects } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Top Gradient/Solid Bar Accent */}
        <View style={styles.topAccentBar} />

        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.name}>{personalInfo?.fullName || 'Your Name'}</Text>
            {personalInfo?.headline && <Text style={styles.headline}>{personalInfo.headline}</Text>}
          </View>
          <View style={styles.headerRightBox}>
            {personalInfo?.email && (
              <View style={styles.contactItem}>
                <View style={styles.contactDot} />
                <Text style={styles.contactText}>{personalInfo.email}</Text>
              </View>
            )}
            {personalInfo?.phone && (
              <View style={styles.contactItem}>
                <View style={styles.contactDot} />
                <Text style={styles.contactText}>{personalInfo.phone}</Text>
              </View>
            )}
            {personalInfo?.location && (
              <View style={styles.contactItem}>
                <View style={styles.contactDot} />
                <Text style={styles.contactText}>{personalInfo.location}</Text>
              </View>
            )}
            {personalInfo?.linkedin && (
              <View style={styles.contactItem}>
                <View style={styles.contactDot} />
                <Text style={styles.contactText}>
                  {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Dual Column Layout */}
        <View style={styles.columnsContainer}>
          {/* Left Column */}
          <View style={styles.leftColumn}>
            {/* Summary */}
            {summary && (
              <View style={styles.section}>
                <View style={styles.sectionTitleRow}>
                  <View style={styles.sectionIndicator} />
                  <Text style={styles.sectionTitle}>Summary</Text>
                </View>
                <Text style={styles.summaryText}>{summary}</Text>
              </View>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionTitleRow}>
                  <View style={styles.sectionIndicator} />
                  <Text style={styles.sectionTitle}>Experience</Text>
                </View>
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
          </View>

          {/* Right Column */}
          <View style={styles.rightColumn}>
            {/* Skills Panel */}
            {skills && skills.length > 0 && (
              <View style={styles.skillsPanel} wrap={false}>
                <Text style={styles.skillsTitle}>Expertise</Text>
                <View style={styles.skillsContainer}>
                  {skills.map((skill: string, idx: number) => (
                    <View key={idx} style={styles.skillPill}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Education */}
            {education && education.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionTitleRow}>
                  <View style={styles.sectionIndicator} />
                  <Text style={styles.sectionTitle}>Education</Text>
                </View>
                {education.map((edu: any, idx: number) => (
                  <View key={idx} style={styles.eduBlock} wrap={false}>
                    <Text style={styles.eduDegree}>{edu.degree}</Text>
                    <Text style={styles.eduSchool}>{edu.school}</Text>
                    <Text style={styles.eduYear}>{edu.year}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionTitleRow}>
                  <View style={styles.sectionIndicator} />
                  <Text style={styles.sectionTitle}>Projects</Text>
                </View>
                {projects.map((project: any, idx: number) => (
                  <View key={idx} style={{ marginBottom: 8 }} wrap={false}>
                    <Text style={[styles.jobRole, { fontSize: 9 }]}>{project.name}</Text>
                    {project.technologies && project.technologies.length > 0 && (
                      <Text style={{ fontSize: 7.5, color: '#64748b', fontStyle: 'italic', marginTop: 1 }}>
                        {project.technologies.join(', ')}
                      </Text>
                    )}
                    {project.link && (
                      <Text style={{ fontSize: 7.5, color: '#4f46e5', marginTop: 1 }}>
                        {project.link.replace(/^https?:\/\/(www\.)?/, '')}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}
