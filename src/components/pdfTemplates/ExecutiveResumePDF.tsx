import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 40,
    fontFamily: 'Times-Roman',
    fontSize: 10,
    lineHeight: 1.5,
    color: '#1e293b',
    backgroundColor: '#FCFCFC',
  },
  topGoldBar: {
    width: 60,
    height: 3,
    backgroundColor: '#B38F4F',
    alignSelf: 'center',
    marginBottom: 12,
  },
  header: {
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 12,
    marginBottom: 14,
  },
  name: {
    fontSize: 22,
    fontFamily: 'Helvetica',
    fontWeight: 'normal',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#0f172a',
  },
  headline: {
    fontSize: 9.5,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#B38F4F',
    marginTop: 10,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    fontSize: 8.5,
    color: '#64748b',
    marginTop: 8,
    gap: 6,
  },
  contactSeparator: {
    color: '#B38F4F',
  },
  summarySection: {
    marginTop: 10,
    marginBottom: 14,
    textAlign: 'center',
    alignSelf: 'center',
    maxWidth: '85%',
  },
  summaryTitle: {
    fontSize: 8.5,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#B38F4F',
    textAlign: 'center',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 9.5,
    fontStyle: 'italic',
    color: '#334155',
    lineHeight: 1.45,
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#0f172a',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 3,
    marginBottom: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  roleTitle: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  dateText: {
    fontSize: 8.5,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  companyText: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#B38F4F',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  bulletList: {
    marginBottom: 10,
  },
  bulletItem: {
    flexDirection: 'row',
    marginLeft: 12,
    marginBottom: 3,
  },
  bulletSign: {
    width: 8,
    fontSize: 9,
    color: '#94a3b8',
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.4,
    color: '#334155',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  skillText: {
    fontSize: 9,
    color: '#1e293b',
    fontFamily: 'Times-Roman',
  },
  skillSeparator: {
    color: '#e2e8f0',
  },
});

interface ResumePDFProps {
  data: any;
}

export default function ExecutiveResumePDF({ data }: ResumePDFProps) {
  const { personalInfo, summary, experience, education, skills, projects } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Decorative Golden Bar */}
        <View style={styles.topGoldBar} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo?.fullName || 'Your Name'}</Text>
          {personalInfo?.headline && <Text style={styles.headline}>{personalInfo.headline}</Text>}
          <View style={styles.contactRow}>
            {personalInfo?.email && <Text>{personalInfo.email}</Text>}
            {personalInfo?.phone && (
              <>
                <Text style={styles.contactSeparator}>|</Text>
                <Text>{personalInfo.phone}</Text>
              </>
            )}
            {personalInfo?.location && (
              <>
                <Text style={styles.contactSeparator}>|</Text>
                <Text>{personalInfo.location}</Text>
              </>
            )}
            {personalInfo?.linkedin && (
              <>
                <Text style={styles.contactSeparator}>|</Text>
                <Text>{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</Text>
              </>
            )}
          </View>
        </View>

        {/* Executive Statement (Centered Summary) */}
        {summary && (
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Executive Statement</Text>
            <Text style={styles.summaryText}>"{summary}"</Text>
          </View>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Leadership & Accomplishments</Text>
            {experience.map((job: any, index: number) => (
              <View key={index} wrap={false}>
                <View style={styles.rowBetween}>
                  <Text style={styles.roleTitle}>{job.role}</Text>
                  <Text style={styles.dateText}>
                    {job.startDate && job.endDate ? `${job.startDate} - ${job.endDate}` : (job.startDate || job.endDate || '')}
                  </Text>
                </View>
                <Text style={styles.companyText}>{job.company}</Text>
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

        {/* Education */}
        {education && education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu: any, index: number) => (
              <View key={index} style={{ marginBottom: 6 }} wrap={false}>
                <View style={styles.rowBetween}>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                    <Text style={[styles.roleTitle, { fontSize: 10 }]}>{edu.degree}</Text>
                    <Text style={{ fontSize: 8.5, color: '#cca355', marginHorizontal: 6 }}>—</Text>
                    <Text style={{ fontSize: 9, fontStyle: 'italic', color: '#475569' }}>{edu.school}</Text>
                  </View>
                  <Text style={styles.dateText}>{edu.year}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Strategic Projects</Text>
            {projects.map((project: any, index: number) => (
              <View key={index} wrap={false}>
                <View style={styles.rowBetween}>
                  <Text style={styles.roleTitle}>{project.name}</Text>
                  {project.link && (
                    <Text style={[styles.dateText, { color: '#B38F4F' }]}>
                      {project.link.replace(/^https?:\/\/(www\.)?/, '')}
                    </Text>
                  )}
                </View>
                {project.technologies && project.technologies.length > 0 && (
                  <Text style={[styles.companyText, { fontSize: 8, marginTop: 1, marginBottom: 4 }]}>
                    Technologies: {project.technologies.join(', ')}
                  </Text>
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

        {/* Core Expertise (Skills) */}
        {skills && skills.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Core Expertise</Text>
            <View style={styles.skillsContainer}>
              {skills.map((skill: string, index: number) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.skillText}>{skill}</Text>
                  {index < skills.length - 1 && (
                    <Text style={[styles.skillSeparator, { marginLeft: 8 }]}>•</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
