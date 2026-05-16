import React, { useState, useRef, useEffect } from 'react';
import {
  Animated,
  Easing,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';

const QUESTIONS = [
  {
    question: "How does your organization currently handle data analysis?",
    options: ["Manual spreadsheets", "Basic BI tools", "Advanced analytics platform", "AI-powered insights"],
  },
  {
    question: "What is your current cloud adoption level?",
    options: ["On-premise only", "Partial cloud migration", "Mostly cloud", "Cloud-native"],
  },
  {
    question: "How mature is your cybersecurity posture?",
    options: ["Basic antivirus only", "Firewall + basic monitoring", "SOC team in place", "AI-driven threat detection"],
  },
  {
    question: "How do you handle customer interactions?",
    options: ["Phone/email only", "CRM system", "Omnichannel platform", "AI-personalized engagement"],
  },
  {
    question: "What best describes your AI/ML usage?",
    options: ["Not using AI", "Exploring AI tools", "Some AI in production", "AI-first strategy"],
  },
];

function getGrade(score: number): { grade: string; label: string; recommendation: string; color: string } {
  if (score >= 13) return { grade: 'A', label: 'AI Leader', recommendation: 'Your organization is leading the AI curve. WeThink can help you scale further and optimize your AI infrastructure.', color: '#059669' };
  if (score >= 10) return { grade: 'B', label: 'Digitally Advanced', recommendation: 'You have strong digital foundations. WeThink can help you implement advanced AI models to gain a competitive edge.', color: '#0055FF' };
  if (score >= 6) return { grade: 'C', label: 'Developing', recommendation: 'You\'re on the right path. WeThink\'s consulting team can accelerate your digital transformation journey.', color: '#D97706' };
  return { grade: 'D', label: 'Getting Started', recommendation: 'There\'s huge potential ahead! WeThink\'s starter packages are designed to help organizations like yours build a solid AI foundation.', color: '#DC2626' };
}

export default function QuizScreen() {
  const { colors } = useTheme();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentQ / QUESTIONS.length) * 100,
      duration: 400,
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, [currentQ]);

  const selectOption = (optionIndex: number) => {
    if (selected !== null) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelected(optionIndex);
  };

  const nextQuestion = () => {
    if (selected === null) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newAnswers = [...answers, selected];
    if (currentQ + 1 >= QUESTIONS.length) {
      setAnswers(newAnswers);
      setShowResults(true);
      const total = newAnswers.reduce((sum, a) => sum + a, 0);
      Animated.timing(scoreAnim, {
        toValue: (total / 15) * 100,
        duration: 1200,
        useNativeDriver: false,
        easing: Easing.out(Easing.cubic),
      }).start();
      Animated.timing(progressAnim, {
        toValue: 100,
        duration: 400,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.sequence([
        Animated.timing(slideAnim, { toValue: -30, duration: 150, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
      setAnswers(newAnswers);
      setCurrentQ(prev => prev + 1);
      setSelected(null);
    }
  };

  const score = answers.reduce((s, a) => s + a, 0);
  const gradeInfo = getGrade(score);

  const progressWidth = progressAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={['#0055FF', '#3B82F6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Readiness Quiz</Text>
        <View style={{ width: 36 }} />
      </LinearGradient>

      <View style={[styles.progressContainer, { backgroundColor: colors.surface }]}>
        <View style={[styles.progressTrack, { backgroundColor: colors.borderLight }]}>
          <Animated.View style={[styles.progressBar, { width: progressWidth, backgroundColor: '#0055FF' }]} />
        </View>
        <Text style={[styles.progressLabel, { color: colors.textMuted }]}>
          {showResults ? 'Complete!' : `Question ${currentQ + 1} of ${QUESTIONS.length}`}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!showResults ? (
          <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
            <Text style={[styles.questionText, { color: colors.text }]}>
              {QUESTIONS[currentQ].question}
            </Text>
            <View style={styles.optionsContainer}>
              {QUESTIONS[currentQ].options.map((option, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.optionCard,
                    {
                      backgroundColor: selected === i ? '#0055FF' : colors.surface,
                      borderColor: selected === i ? '#0055FF' : colors.borderLight,
                    },
                  ]}
                  onPress={() => selectOption(i)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.optionBullet, { backgroundColor: selected === i ? 'rgba(255,255,255,0.3)' : colors.borderLight }]}>
                    <Text style={[styles.optionBulletText, { color: selected === i ? '#FFFFFF' : colors.textMuted }]}>
                      {String.fromCharCode(65 + i)}
                    </Text>
                  </View>
                  <Text style={[styles.optionText, { color: selected === i ? '#FFFFFF' : colors.text }]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {selected !== null && (
              <TouchableOpacity style={[styles.nextBtn, { backgroundColor: '#0055FF' }]} onPress={nextQuestion}>
                <Text style={styles.nextBtnText}>
                  {currentQ + 1 >= QUESTIONS.length ? 'See Results' : 'Next Question →'}
                </Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        ) : (
          <View style={styles.resultsContainer}>
            <View style={[styles.scoreCircle, { borderColor: gradeInfo.color }]}>
              <Text style={[styles.scoreGrade, { color: gradeInfo.color }]}>{gradeInfo.grade}</Text>
              <Text style={[styles.scoreValue, { color: colors.text }]}>{score}/15</Text>
            </View>
            <Text style={[styles.scoreLabel, { color: gradeInfo.color }]}>{gradeInfo.label}</Text>
            <View style={[styles.recommendationCard, { backgroundColor: colors.surface, borderLeftColor: gradeInfo.color }]}>
              <Text style={[styles.recommendationTitle, { color: colors.text }]}>WeThink Recommendation</Text>
              <Text style={[styles.recommendationText, { color: colors.textSecondary }]}>{gradeInfo.recommendation}</Text>
            </View>
            <TouchableOpacity
              style={[styles.nextBtn, { backgroundColor: gradeInfo.color }]}
              onPress={() => router.push('/tools/consultation' as any)}
            >
              <Text style={styles.nextBtnText}>Book Free Consultation →</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.retakeBtn, { borderColor: colors.border }]}
              onPress={() => {
                setCurrentQ(0);
                setAnswers([]);
                setSelected(null);
                setShowResults(false);
                progressAnim.setValue(0);
              }}
            >
              <Text style={[styles.retakeBtnText, { color: colors.textSecondary }]}>Retake Quiz</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  progressContainer: { paddingHorizontal: 20, paddingVertical: 12, gap: 6 },
  progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 3 },
  progressLabel: { fontSize: 12, fontWeight: '500', textAlign: 'right' },
  content: { padding: 20, paddingBottom: 40 },
  questionText: { fontSize: 20, fontWeight: '800', lineHeight: 28, marginBottom: 24, letterSpacing: -0.3 },
  optionsContainer: { gap: 12, marginBottom: 24 },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  optionBullet: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  optionBulletText: { fontSize: 13, fontWeight: '700' },
  optionText: { flex: 1, fontSize: 15, fontWeight: '600' },
  nextBtn: { borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  nextBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  resultsContainer: { alignItems: 'center', gap: 20 },
  scoreCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  scoreGrade: { fontSize: 44, fontWeight: '900' },
  scoreValue: { fontSize: 16, fontWeight: '700' },
  scoreLabel: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  recommendationCard: {
    width: '100%',
    padding: 18,
    borderRadius: 16,
    borderLeftWidth: 4,
    gap: 8,
  },
  recommendationTitle: { fontSize: 15, fontWeight: '700' },
  recommendationText: { fontSize: 14, lineHeight: 21 },
  retakeBtn: { width: '100%', borderRadius: 16, paddingVertical: 14, alignItems: 'center', borderWidth: 1.5 },
  retakeBtnText: { fontSize: 15, fontWeight: '600' },
});
