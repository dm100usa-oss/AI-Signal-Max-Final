// components/pdf/ReportPDF_Developer.tsx
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import React from "react";

export interface ReportPDFProps {
  url: string;
  score: number;
  date: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    backgroundColor: "#ffffff",
    color: "#111111",
  },
  header: {
    textAlign: "center",
    marginBottom: 25,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: "#444",
  },
  scoreBox: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: "center",
    textAlign: "center",
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    border: "5 solid #0072FF",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  scoreText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 15,
  },
  line: {
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: "bold",
  },
  desc: {
    fontSize: 10,
    color: "#333",
  },
  footer: {
    fontSize: 8,
    color: "#777",
    marginTop: 40,
    textAlign: "center",
  },
});

export default function ReportPDF_Developer({ url, score, date }: ReportPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>DEVELOPER — AI SIGNAL MAX</Text>
          <Text style={styles.subtitle}>Technical Checklist for Website Visibility</Text>
          <Text style={styles.subtitle}>Date: {date}</Text>
          <Text style={styles.subtitle}>{url}</Text>
        </View>

        <View style={styles.scoreBox}>
          <View style={styles.circle}>
            <Text style={styles.scoreText}>{score}%</Text>
          </View>
          <Text style={{ marginTop: 6 }}>
            Visibility level: {score < 50 ? "Low" : score < 75 ? "Moderate" : "High"}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Main Technical Checks</Text>

        <View style={styles.line}>
          <Text style={styles.label}>1. Robots.txt</Text>
          <Text style={styles.desc}>Ensure AI crawlers are allowed and file is accessible.</Text>
        </View>

        <View style={styles.line}>
          <Text style={styles.label}>2. Sitemap.xml</Text>
          <Text style={styles.desc}>Confirm sitemap is public and updated regularly.</Text>
        </View>

        <View style={styles.line}>
          <Text style={styles.label}>3. Schema Markup</Text>
          <Text style={styles.desc}>
            Use structured data (JSON-LD) to help AI systems understand content.
          </Text>
        </View>

        <View style={styles.line}>
          <Text style={styles.label}>4. Meta Tags</Text>
          <Text style={styles.desc}>Titles, descriptions, and OpenGraph tags must be valid.</Text>
        </View>

        <View style={styles.line}>
          <Text style={styles.label}>5. Page Speed</Text>
          <Text style={styles.desc}>
            Optimize images, caching, and scripts to keep LCP under 2.5 seconds.
          </Text>
        </View>

        <Text style={styles.footer}>
          © 2025 AI Signal Max. All rights reserved. This report is auto-generated for informational
          purposes only.
        </Text>
      </Page>
    </Document>
  );
}
