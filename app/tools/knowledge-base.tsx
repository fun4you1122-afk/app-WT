import React, { useState, useRef } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';

const ARTICLES = [
  {
    section: 'Getting Started',
    color: '#059669',
    items: [
      { title: 'What is AI and how can it benefit your business?', readTime: '5 min', content: 'Artificial Intelligence (AI) refers to computer systems that can perform tasks that normally require human intelligence. For businesses, AI can automate repetitive work, provide insights from large datasets, improve customer service through chatbots, and optimize supply chains. WeThink helps enterprises identify the highest-ROI use cases for AI adoption and implements solutions tailored to Gulf market needs.' },
      { title: 'How to assess your digital readiness', readTime: '4 min', content: 'Digital readiness assessment involves evaluating your current IT infrastructure, data quality, talent capabilities, and leadership alignment. Key indicators include: cloud adoption rate, data centralization, employee digital literacy, and existing automation coverage. WeThink offers free Digital Maturity Assessments that benchmark your organization against Gulf industry peers and provide a clear transformation roadmap.' },
      { title: 'WeThink onboarding guide', readTime: '6 min', content: 'Welcome to WeThink! Our onboarding process begins with a kickoff workshop to understand your goals, followed by a technical discovery phase where we audit your existing systems. We then deliver a Solution Design Document for your review. Once approved, our agile delivery team starts a 12-week implementation sprint, with weekly progress updates and a dedicated success manager throughout.' },
    ],
  },
  {
    section: 'AI & ML',
    color: '#7C3AED',
    items: [
      { title: 'Introduction to Machine Learning', readTime: '7 min', content: 'Machine Learning (ML) is a subset of AI where systems learn from data to improve their performance without being explicitly programmed. The three main types are supervised learning (learning from labeled data), unsupervised learning (finding patterns in unlabeled data), and reinforcement learning (learning through rewards and penalties). ML powers WeThink\'s fraud detection, recommendation engines, and predictive analytics products.' },
      { title: 'Natural Language Processing explained', readTime: '5 min', content: 'Natural Language Processing (NLP) enables computers to understand, interpret, and generate human language. Applications include sentiment analysis, chatbots, document summarization, and language translation. WeThink\'s Arabic NLP models are trained specifically on Gulf dialects and Modern Standard Arabic, enabling highly accurate processing for regional enterprise applications.' },
      { title: 'Computer Vision use cases in retail', readTime: '6 min', content: 'Computer Vision allows machines to interpret visual information from images and video. In retail, it powers cashierless checkout, shelf-stock monitoring, customer behavior analysis, and security surveillance. WeThink has deployed computer vision systems in 14 retail chains across the UAE and KSA, reducing shrinkage by an average of 34% and improving checkout speed by 60%.' },
    ],
  },
  {
    section: 'Security',
    color: '#DC2626',
    items: [
      { title: 'Zero-trust security architecture', readTime: '8 min', content: 'Zero-trust is a security model that assumes no user or device should be trusted by default, even if they are inside the network perimeter. Every access request is verified, authenticated, and authorized continuously. Key components include identity verification, microsegmentation, least-privilege access, and continuous monitoring. WeThink helps organizations design and implement zero-trust frameworks compliant with UAE NESA requirements.' },
      { title: 'How to protect your cloud infrastructure', readTime: '6 min', content: 'Cloud security requires a shared responsibility model where the cloud provider secures the infrastructure and you secure your data and applications. Best practices include: encrypting data at rest and in transit, enforcing multi-factor authentication, conducting regular security audits, implementing cloud-native security tools, and training staff on phishing awareness. WeThink\'s Cloud Security Practice offers 24/7 monitoring and incident response.' },
      { title: 'Incident response planning', readTime: '5 min', content: 'An Incident Response Plan (IRP) defines the procedures your organization follows when a security breach occurs. The six phases are: Preparation, Identification, Containment, Eradication, Recovery, and Lessons Learned. Effective IRPs include clear roles, communication templates, escalation paths, and regular tabletop exercises. WeThink can help develop and test your IRP to minimize breach impact and recovery time.' },
    ],
  },
  {
    section: 'Cloud',
    color: '#0055FF',
    items: [
      { title: 'AWS vs Azure vs Google Cloud comparison', readTime: '9 min', content: 'AWS leads in market share with the broadest service catalog, making it ideal for startups and enterprises needing flexibility. Azure excels for organizations heavily invested in Microsoft products and has strong UAE data center presence. Google Cloud leads in AI/ML tooling and Kubernetes. WeThink is certified across all three platforms and helps you choose the right mix based on your workloads, compliance needs, and cost targets.' },
      { title: 'Microservices architecture best practices', readTime: '7 min', content: 'Microservices decompose applications into small, independent services that communicate via APIs. Benefits include independent scaling, faster deployments, and technology flexibility. Best practices: design services around business capabilities, implement API gateways, use container orchestration (Kubernetes), establish service meshes for communication, and invest in observability tooling. WeThink has migrated 30+ monolithic applications to microservices architectures.' },
      { title: 'DevOps and CI/CD pipelines', readTime: '6 min', content: 'DevOps combines development and operations practices to shorten the software delivery lifecycle. CI/CD (Continuous Integration/Continuous Deployment) automates code testing and deployment. Key tools include Git, Jenkins, GitHub Actions, Docker, and Kubernetes. Mature CI/CD pipelines can reduce deployment time from weeks to minutes and achieve 99.9% deployment success rates. WeThink implements end-to-end DevOps practices for enterprise clients.' },
    ],
  },
];

interface Article {
  title: string;
  readTime: string;
  content: string;
}

export default function KnowledgeBaseScreen() {
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<{ article: Article; sectionColor: string } | null>(null);

  const filteredSections = ARTICLES.map(section => ({
    ...section,
    items: section.items.filter(item =>
      search.trim() === '' || item.title.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(s => s.items.length > 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={['#7C3AED', '#A855F7']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Knowledge Base</Text>
        <View style={{ width: 36 }} />
      </LinearGradient>

      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search articles..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={[styles.clearBtn, { color: colors.textMuted }]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {filteredSections.map((section) => (
          <View key={section.section} style={styles.sectionGroup}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionDot, { backgroundColor: section.color }]} />
              <Text style={[styles.sectionTitle, { color: section.color }]}>{section.section}</Text>
            </View>
            {section.items.map((item, j) => (
              <TouchableOpacity
                key={j}
                style={[styles.articleCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedArticle({ article: item, sectionColor: section.color });
                }}
                activeOpacity={0.85}
              >
                <View style={styles.articleTop}>
                  <Text style={[styles.articleTitle, { color: colors.text }]} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <View style={[styles.readTimeBadge, { backgroundColor: section.color + '18' }]}>
                    <Text style={[styles.readTimeText, { color: section.color }]}>{item.readTime}</Text>
                  </View>
                </View>
                <View style={[styles.sectionBadge, { backgroundColor: section.color + '18' }]}>
                  <Text style={[styles.sectionBadgeText, { color: section.color }]}>{section.section}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>

      <Modal
        visible={selectedArticle !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedArticle(null)}
      >
        {selectedArticle && (
          <View style={[styles.modal, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHeader, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
              <TouchableOpacity onPress={() => setSelectedArticle(null)} style={styles.modalClose}>
                <Text style={[styles.modalCloseText, { color: colors.textSecondary }]}>✕</Text>
              </TouchableOpacity>
              <View style={[styles.readTimeBadge, { backgroundColor: selectedArticle.sectionColor + '20' }]}>
                <Text style={[styles.readTimeText, { color: selectedArticle.sectionColor }]}>
                  {selectedArticle.article.readTime} read
                </Text>
              </View>
            </View>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{selectedArticle.article.title}</Text>
              <View style={[styles.modalDivider, { backgroundColor: selectedArticle.sectionColor }]} />
              <Text style={[styles.modalBody, { color: colors.textSecondary }]}>{selectedArticle.article.content}</Text>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  backText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  headerTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: 4 },
  clearBtn: { fontSize: 16, paddingHorizontal: 4 },
  content: { padding: 16, gap: 20 },
  sectionGroup: { gap: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  sectionDot: { width: 10, height: 10, borderRadius: 5 },
  sectionTitle: { fontSize: 15, fontWeight: '800' },
  articleCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    gap: 10,
  },
  articleTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  articleTitle: { flex: 1, fontSize: 14, fontWeight: '700', lineHeight: 20 },
  readTimeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  readTimeText: { fontSize: 11, fontWeight: '600' },
  sectionBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  sectionBadgeText: { fontSize: 11, fontWeight: '600' },
  modal: { flex: 1 },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  modalClose: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  modalCloseText: { fontSize: 16, fontWeight: '600' },
  modalContent: { padding: 20, gap: 16 },
  modalTitle: { fontSize: 22, fontWeight: '800', lineHeight: 30, letterSpacing: -0.4 },
  modalDivider: { height: 3, borderRadius: 2, width: 40 },
  modalBody: { fontSize: 15, lineHeight: 24 },
});
