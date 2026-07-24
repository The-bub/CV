import { createElement as h } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToFile,
} from "@react-pdf/renderer";
import {
  profile,
  experiences,
  education,
  certifications,
  skills,
} from "../src/data.js";

const ACCENT = "#0071e3";
const TEXT = "#1d1d1f";
const TEXT_DIM = "#6e6e73";
const BORDER = "#d8d8dc";

const styles = StyleSheet.create({
  page: {
    padding: "32 40",
    fontSize: 9.5,
    fontFamily: "Helvetica",
    color: TEXT,
  },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
  },
  title: {
    fontSize: 12,
    color: ACCENT,
    marginTop: 2,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: 8.5,
    color: TEXT_DIM,
    marginBottom: 10,
  },
  contactItem: {
    marginRight: 14,
  },
  bio: {
    fontSize: 9,
    color: TEXT_DIM,
    lineHeight: 1.5,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: ACCENT,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    borderBottom: `1 solid ${BORDER}`,
    paddingBottom: 4,
  },
  section: {
    marginBottom: 14,
  },
  entry: {
    marginBottom: 8,
  },
  entryHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  entryRole: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  entryPeriod: {
    fontSize: 8.5,
    color: ACCENT,
    fontFamily: "Helvetica-Bold",
  },
  entryCompany: {
    fontSize: 9,
    color: TEXT_DIM,
    marginBottom: 3,
  },
  bulletList: {
    marginTop: 2,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 1.5,
  },
  bulletDot: {
    width: 8,
    fontSize: 9,
    color: TEXT_DIM,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: TEXT_DIM,
    lineHeight: 1.4,
  },
  skillCategory: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  eduTitle: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
  },
  eduSchool: {
    fontSize: 8.5,
    color: TEXT_DIM,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    fontSize: 7.5,
    color: TEXT_DIM,
    textAlign: "center",
  },
});

function bulletList(items) {
  return h(
    View,
    { style: styles.bulletList },
    items.map((item, i) =>
      h(
        View,
        { key: i, style: styles.bulletRow },
        h(Text, { style: styles.bulletDot }, "•"),
        h(Text, { style: styles.bulletText }, item),
      ),
    ),
  );
}

function ExperienceSection() {
  return h(
    View,
    { style: styles.section },
    h(Text, { style: styles.sectionTitle }, "Expériences professionnelles"),
    experiences.map((exp, i) =>
      h(
        View,
        { key: i, style: styles.entry, wrap: false },
        h(
          View,
          { style: styles.entryHeaderRow },
          h(Text, { style: styles.entryRole }, exp.role),
          h(Text, { style: styles.entryPeriod }, exp.period),
        ),
        h(Text, { style: styles.entryCompany }, exp.company),
        bulletList(exp.items),
      ),
    ),
  );
}

function EducationSection() {
  return h(
    View,
    { style: styles.section, wrap: false },
    h(Text, { style: styles.sectionTitle }, "Formation"),
    education.map((ed, i) =>
      h(
        View,
        { key: i, style: styles.entry },
        h(
          View,
          { style: styles.entryHeaderRow },
          h(Text, { style: styles.eduTitle }, ed.title),
          h(Text, { style: styles.entryPeriod }, ed.period),
        ),
        h(Text, { style: styles.eduSchool }, ed.school),
      ),
    ),
  );
}

function CertificationsSection() {
  return h(
    View,
    { style: styles.section, wrap: false },
    h(Text, { style: styles.sectionTitle }, "Certifications"),
    certifications.map((cert, i) =>
      h(
        View,
        { key: i, style: styles.entry },
        h(
          View,
          { style: styles.entryHeaderRow },
          h(Text, { style: styles.eduTitle }, `${cert.name} — ${cert.org}`),
        ),
        h(Text, { style: styles.eduSchool }, cert.fullName),
      ),
    ),
  );
}

function SkillsSection() {
  return h(
    View,
    { style: styles.section },
    h(Text, { style: styles.sectionTitle }, "Compétences"),
    skills.map((group, i) =>
      h(
        View,
        { key: i, style: { marginBottom: 8 }, wrap: false },
        h(Text, { style: styles.skillCategory }, group.category),
        bulletList(group.items),
      ),
    ),
  );
}

function ResumeDocument() {
  return h(
    Document,
    { title: `CV — ${profile.name}`, author: profile.name },
    h(
      Page,
      { size: "A4", style: styles.page },
      h(Text, { style: styles.name }, profile.name),
      h(Text, { style: styles.title }, profile.title),
      h(
        View,
        { style: styles.contactRow },
        h(Text, { style: styles.contactItem }, profile.contact.email),
        h(Text, { style: styles.contactItem }, profile.contact.mobile),
        h(Text, { style: styles.contactItem }, profile.contact.address),
        h(Text, { style: styles.contactItem }, profile.contact.linkedin),
      ),
      h(Text, { style: styles.bio }, profile.bio),
      h(ExperienceSection),
      h(EducationSection),
      h(CertificationsSection),
      h(SkillsSection),
      h(
        Text,
        { style: styles.footer, fixed: true },
        `${profile.name} — ${profile.title}`,
      ),
    ),
  );
}

const outputPath = process.argv[2] ?? "dist/eliot-bedel-cv.pdf";

await renderToFile(h(ResumeDocument), outputPath);

console.log(`PDF généré : ${outputPath}`);
