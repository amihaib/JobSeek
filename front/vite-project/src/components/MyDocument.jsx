import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import iso6391 from 'iso-639-1';

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 10 },
  title: { fontSize: 24, marginBottom: 10 },
  subtitle: { fontSize: 18, marginBottom: 10 },
  text: { fontSize: 12, marginBottom: 5 },
});

const MyDocument = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>{data.name}</Text>
          <Text style={styles.text}>{data.email}</Text>
          <Text style={styles.text}>{data.phone}</Text>
          <Text style={styles.text}>{data.linkedin}</Text>
          <Text style={styles.text}>{data.socialMedia}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>תקציר מקדים:</Text>
          <Text style={styles.text}>{data.summary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>כישורים:</Text>
          {data.skills.map((skill, index) => (
            <Text key={index} style={styles.text}>{skill}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>שפות:</Text>
          {data.languages.map((lang, index) => (
            <Text key={index} style={styles.text}>{iso6391.getName(lang.value)}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>השכלה:</Text>
          {data.education.map((edu, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.text}>תואר: {edu.degree}</Text>
              <Text style={styles.text}>מוסד לימודים: {edu.school}</Text>
              <Text style={styles.text}>תאריך התחלה: {edu.startDate}</Text>
              <Text style={styles.text}>תאריך סיום: {edu.endDate}</Text>
              <Text style={styles.text}>תיאור: {edu.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>ניסיון תעסוקתי:</Text>
          {data.experience.map((exp, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.text}>תפקיד: {exp.position}</Text>
              <Text style={styles.text}>חברה: {exp.company}</Text>
              <Text style={styles.text}>תאריך התחלה: {exp.startDate}</Text>
              <Text style={styles.text}>תאריך סיום: {exp.endDate}</Text>
              <Text style={styles.text}>עדיין עובד כאן: {exp.current ? 'כן' : 'לא'}</Text>
              <Text style={styles.text}>תיאור: {exp.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>פרויקטים:</Text>
          {data.projects.map((project, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.text}>שם הפרויקט: {project.title}</Text>
              <Text style={styles.text}>תיאור: {project.description}</Text>
              <Text style={styles.text}>קישור: {project.link}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;
