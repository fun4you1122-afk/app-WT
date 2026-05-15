import React, { useState, useRef, useCallback } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useCommunity } from '../context/CommunityContext';

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ['AI', 'Tech', 'Business', 'UAE', 'Global', 'Health'];
const POST_TYPES = ['Discussion', 'Question', 'Poll'] as const;
type PostType = typeof POST_TYPES[number];

const POLL_DURATIONS = ['24h', '3d', '7d'] as const;
type PollDuration = typeof POLL_DURATIONS[number];

const TOPIC_SUGGESTIONS = [
  'Is social media doing more harm than good?',
  'Will quantum computing change cybersecurity?',
  'Should AI have voting rights by 2050?',
  'Are NFTs a scam or the future of ownership?',
  'Should UAE ban single-use plastics entirely?',
];

const MAX_CHARS = 500;

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ label, colors }: { label: string; colors: any }) {
  return (
    <Text style={[composeStyles.sectionLabel, { color: colors.textMuted }]}>
      {label}
    </Text>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function ComposeScreen() {
  const { colors } = useTheme();
  const { addPost } = useCommunity();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('AI');
  const [postType, setPostType] = useState<PostType>('Discussion');
  const [hashtags, setHashtags] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Topic suggestions
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const suggestAnim = useRef(new Animated.Value(0)).current;

  // Poll
  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollDuration, setPollDuration] = useState<PollDuration>('3d');
  const pollAnim = useRef(new Animated.Value(0)).current;

  // Success animation
  const successScale = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;
  const [posting, setPosting] = useState(false);

  // Bold / italic formatting state (UI only)
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);

  const charCount = body.length;
  const charPct = charCount / MAX_CHARS;
  const charColor =
    charCount > MAX_CHARS
      ? colors.error
      : charPct >= 0.8
      ? colors.warning
      : colors.textMuted;

  const canPost =
    title.trim().length > 0 && body.trim().length > 0 && charCount <= MAX_CHARS;

  // ── Suggest topics ─────────────────────────────────────────────────────────

  const handleSuggest = useCallback(() => {
    if (loadingSuggestions) return;
    setSuggestions([]);
    setLoadingSuggestions(true);
    suggestAnim.setValue(0);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setTimeout(() => {
      setLoadingSuggestions(false);
      setSuggestions(TOPIC_SUGGESTIONS);
      Animated.timing(suggestAnim, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, 1000);
  }, [loadingSuggestions]);

  const pickSuggestion = (s: string) => {
    setTitle(s);
    setSuggestions([]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // ── Poll ───────────────────────────────────────────────────────────────────

  const togglePoll = () => {
    const toValue = showPoll ? 0 : 1;
    setShowPoll(!showPoll);
    setPostType(!showPoll ? 'Poll' : 'Discussion');
    Animated.timing(pollAnim, {
      toValue,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const addPollOption = () => {
    if (pollOptions.length < 6) {
      setPollOptions(prev => [...prev, '']);
    }
  };

  const updatePollOption = (idx: number, val: string) => {
    setPollOptions(prev => prev.map((o, i) => (i === idx ? val : o)));
  };

  const removePollOption = (idx: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(prev => prev.filter((_, i) => i !== idx));
    }
  };

  // ── Image picker ───────────────────────────────────────────────────────────

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: true,
      aspect: [16, 9],
    });
    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // ── Post ───────────────────────────────────────────────────────────────────

  const handlePost = () => {
    if (!canPost || posting) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPosting(true);

    const isPoll = postType === 'Poll' && pollQuestion.trim().length > 0;
    const validOptions = pollOptions.filter(o => o.trim().length > 0);
    addPost({
      id: String(Date.now()),
      author: 'You',
      initials: 'U',
      avatarColor: colors.accent,
      time: 'Just now',
      category,
      title: title.trim(),
      preview: body.trim(),
      likes: 0,
      comments: 0,
      sentiment: { pos: 50, neu: 40, neg: 10 },
      isPoll,
      poll: isPoll && validOptions.length >= 2 ? {
        question: pollQuestion.trim(),
        options: validOptions.map(t => ({ text: t, votes: 0 })),
        totalVotes: 0,
      } : undefined,
    });

    Animated.sequence([
      Animated.parallel([
        Animated.spring(successScale, {
          toValue: 1,
          tension: 80,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(successOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(900),
      Animated.parallel([
        Animated.timing(successScale, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(successOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setPosting(false);
      router.back();
    });
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <View style={[composeStyles.root, { backgroundColor: colors.background }]}>
      {/* Success overlay */}
      <Animated.View
        style={[
          composeStyles.successOverlay,
          {
            opacity: successOpacity,
            pointerEvents: posting ? 'auto' : 'none',
          },
        ]}
        pointerEvents={posting ? 'auto' : 'none'}
      >
        <Animated.View
          style={[
            composeStyles.successCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.success,
              transform: [{ scale: successScale }],
            },
          ]}
        >
          <Text style={composeStyles.successEmoji}>✅</Text>
          <Text style={[composeStyles.successText, { color: colors.text }]}>
            Post published!
          </Text>
        </Animated.View>
      </Animated.View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View
          style={[
            composeStyles.header,
            { backgroundColor: colors.surface, borderBottomColor: colors.border },
          ]}
        >
          <TouchableOpacity onPress={() => router.back()} style={composeStyles.cancelBtn}>
            <Text style={[composeStyles.cancelText, { color: colors.textSecondary }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <Text style={[composeStyles.headerTitle, { color: colors.text }]}>
            New Post
          </Text>
          <TouchableOpacity
            onPress={handlePost}
            disabled={!canPost || posting}
            style={[
              composeStyles.postBtn,
              {
                backgroundColor: canPost && !posting ? colors.primary : colors.borderLight,
              },
            ]}
            activeOpacity={0.85}
          >
            {posting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text
                style={[
                  composeStyles.postBtnText,
                  { color: canPost ? '#FFFFFF' : colors.textMuted },
                ]}
              >
                Post
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={composeStyles.scrollContent}
          keyboardDismissMode="on-drag"
        >
          {/* Author row */}
          <View style={composeStyles.authorRow}>
            <View style={[composeStyles.avatar, { backgroundColor: colors.accent }]}>
              <Text style={composeStyles.avatarText}>U</Text>
            </View>
            <View>
              <Text style={[composeStyles.authorName, { color: colors.text }]}>
                You
              </Text>
              <Text style={[composeStyles.authorHandle, { color: colors.textMuted }]}>
                @user · WeThink Member
              </Text>
            </View>
          </View>

          {/* Post type toggle */}
          <View style={composeStyles.section}>
            <SectionLabel label="Post Type" colors={colors} />
            <View style={[composeStyles.typeRow, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              {POST_TYPES.map(pt => (
                <TouchableOpacity
                  key={pt}
                  onPress={() => {
                    setPostType(pt);
                    if (pt === 'Poll' && !showPoll) togglePoll();
                    else if (pt !== 'Poll' && showPoll) togglePoll();
                  }}
                  style={[
                    composeStyles.typeBtn,
                    postType === pt && {
                      backgroundColor: colors.primary,
                    },
                  ]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      composeStyles.typeBtnText,
                      { color: postType === pt ? '#FFFFFF' : colors.textSecondary },
                    ]}
                  >
                    {pt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Category chips */}
          <View style={composeStyles.section}>
            <SectionLabel label="Category" colors={colors} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {CATEGORIES.map(cat => {
                const active = category === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setCategory(cat)}
                    style={[
                      composeStyles.catChip,
                      {
                        backgroundColor: active ? colors.accent : colors.inputBg,
                        borderColor: active ? colors.accent : colors.border,
                      },
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        composeStyles.catChipText,
                        { color: active ? '#FFFFFF' : colors.textSecondary },
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Title input */}
          <View style={composeStyles.section}>
            <TextInput
              style={[
                composeStyles.titleInput,
                { color: colors.text, borderBottomColor: colors.borderLight },
              ]}
              value={title}
              onChangeText={setTitle}
              placeholder="What's on your mind?"
              placeholderTextColor={colors.textMuted}
              multiline
              maxLength={120}
            />
          </View>

          {/* Body input */}
          <View style={composeStyles.section}>
            <TextInput
              style={[
                composeStyles.bodyInput,
                {
                  color: colors.text,
                  backgroundColor: colors.inputBg,
                  borderColor: colors.border,
                },
              ]}
              value={body}
              onChangeText={setBody}
              placeholder="Share your perspective... Start a debate, ask a question, or spark a discussion."
              placeholderTextColor={colors.textMuted}
              multiline
              maxLength={MAX_CHARS + 20}
              textAlignVertical="top"
            />
            {/* Character counter */}
            <Text style={[composeStyles.charCounter, { color: charColor }]}>
              {charCount}/{MAX_CHARS}
            </Text>
          </View>

          {/* Formatting toolbar */}
          <View
            style={[
              composeStyles.toolbar,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <TouchableOpacity
              onPress={() => setBold(b => !b)}
              style={[
                composeStyles.toolbarBtn,
                bold && { backgroundColor: colors.primaryLight },
              ]}
            >
              <Text
                style={[
                  composeStyles.toolbarBtnText,
                  { color: bold ? colors.primary : colors.textSecondary, fontWeight: '700' },
                ]}
              >
                B
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setItalic(b => !b)}
              style={[
                composeStyles.toolbarBtn,
                italic && { backgroundColor: colors.accentLight },
              ]}
            >
              <Text
                style={[
                  composeStyles.toolbarBtnText,
                  {
                    color: italic ? colors.accent : colors.textSecondary,
                    fontStyle: 'italic',
                    fontWeight: '700',
                  },
                ]}
              >
                I
              </Text>
            </TouchableOpacity>
            <View style={[composeStyles.toolbarDivider, { backgroundColor: colors.borderLight }]} />
            <TouchableOpacity onPress={pickImage} style={composeStyles.toolbarBtn}>
              <Text style={composeStyles.toolbarEmoji}>📷</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={togglePoll} style={composeStyles.toolbarBtn}>
              <Text style={composeStyles.toolbarEmoji}>📊</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              onPress={handleSuggest}
              style={[
                composeStyles.suggestBtn,
                { backgroundColor: colors.accentLight, borderColor: colors.accent },
              ]}
              activeOpacity={0.8}
              disabled={loadingSuggestions}
            >
              {loadingSuggestions ? (
                <ActivityIndicator color={colors.accent} size="small" />
              ) : (
                <Text style={[composeStyles.suggestBtnText, { color: colors.accent }]}>
                  ✨ Suggest Topics
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Image preview */}
          {selectedImage && (
            <View style={composeStyles.section}>
              <View
                style={[
                  composeStyles.imagePreview,
                  { backgroundColor: colors.inputBg, borderColor: colors.border },
                ]}
              >
                <Text style={[composeStyles.imagePreviewText, { color: colors.textSecondary }]}>
                  📷 Image selected
                </Text>
                <TouchableOpacity onPress={() => setSelectedImage(null)}>
                  <Text style={[composeStyles.imageRemove, { color: colors.error }]}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Topic suggestions */}
          {suggestions.length > 0 && (
            <Animated.View
              style={[
                composeStyles.section,
                {
                  opacity: suggestAnim,
                  transform: [
                    {
                      translateY: suggestAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [10, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View
                style={[
                  composeStyles.suggestionsCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
              >
                <Text style={[composeStyles.suggestionsTitle, { color: colors.textSecondary }]}>
                  ✨ Topic suggestions — tap to use
                </Text>
                {suggestions.map((s, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => pickSuggestion(s)}
                    style={[
                      composeStyles.suggestionItem,
                      i < suggestions.length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: colors.borderLight,
                      },
                    ]}
                    activeOpacity={0.75}
                  >
                    <Text style={[composeStyles.suggestionText, { color: colors.text }]}>
                      {s}
                    </Text>
                    <Text style={{ color: colors.primary, fontSize: 14 }}>→</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Poll creation sub-form */}
          <Animated.View
            style={{
              maxHeight: pollAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 600],
              }),
              opacity: pollAnim,
              overflow: 'hidden',
            }}
          >
            <View style={composeStyles.section}>
              <View
                style={[
                  composeStyles.pollCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
              >
                <Text style={[composeStyles.pollTitle, { color: colors.text }]}>
                  📊 Create Poll
                </Text>

                {/* Poll question */}
                <TextInput
                  style={[
                    composeStyles.pollQuestionInput,
                    {
                      color: colors.text,
                      backgroundColor: colors.inputBg,
                      borderColor: colors.border,
                    },
                  ]}
                  value={pollQuestion}
                  onChangeText={setPollQuestion}
                  placeholder="Poll question..."
                  placeholderTextColor={colors.textMuted}
                />

                {/* Poll options */}
                <Text style={[composeStyles.pollSubLabel, { color: colors.textMuted }]}>
                  Options
                </Text>
                {pollOptions.map((opt, idx) => (
                  <View key={idx} style={composeStyles.pollOptionRow}>
                    <TextInput
                      style={[
                        composeStyles.pollOptionInput,
                        {
                          color: colors.text,
                          backgroundColor: colors.inputBg,
                          borderColor: colors.border,
                          flex: 1,
                        },
                      ]}
                      value={opt}
                      onChangeText={val => updatePollOption(idx, val)}
                      placeholder={`Option ${idx + 1}`}
                      placeholderTextColor={colors.textMuted}
                    />
                    {pollOptions.length > 2 && (
                      <TouchableOpacity
                        onPress={() => removePollOption(idx)}
                        style={[composeStyles.pollRemoveBtn, { backgroundColor: colors.errorLight }]}
                      >
                        <Text style={[composeStyles.pollRemoveBtnText, { color: colors.error }]}>
                          ✕
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                {pollOptions.length < 6 && (
                  <TouchableOpacity
                    onPress={addPollOption}
                    style={[
                      composeStyles.addOptionBtn,
                      { borderColor: colors.border, backgroundColor: colors.inputBg },
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text style={[composeStyles.addOptionText, { color: colors.primary }]}>
                      + Add Option
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Poll duration */}
                <Text style={[composeStyles.pollSubLabel, { color: colors.textMuted }]}>
                  Duration
                </Text>
                <View style={composeStyles.durationRow}>
                  {POLL_DURATIONS.map(d => (
                    <TouchableOpacity
                      key={d}
                      onPress={() => setPollDuration(d)}
                      style={[
                        composeStyles.durationBtn,
                        {
                          backgroundColor:
                            pollDuration === d ? colors.primary : colors.inputBg,
                          borderColor:
                            pollDuration === d ? colors.primary : colors.border,
                        },
                      ]}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          composeStyles.durationBtnText,
                          {
                            color:
                              pollDuration === d ? '#FFFFFF' : colors.textSecondary,
                          },
                        ]}
                      >
                        {d}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Hashtag input */}
          <View style={composeStyles.section}>
            <SectionLabel label="Hashtags" colors={colors} />
            <TextInput
              style={[
                composeStyles.hashtagInput,
                {
                  color: colors.text,
                  backgroundColor: colors.inputBg,
                  borderColor: colors.border,
                },
              ]}
              value={hashtags}
              onChangeText={setHashtags}
              placeholder="#tag1, #tag2, #tag3"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const composeStyles = StyleSheet.create({
  root: { flex: 1 },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  successCard: {
    padding: 36,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 2,
    gap: 12,
  },
  successEmoji: { fontSize: 48 },
  successText: { fontSize: 18, fontWeight: '700' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'ios' ? 56 : 42,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  cancelBtn: { width: 64 },
  cancelText: { fontSize: 15, fontWeight: '500' },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  postBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 64,
    alignItems: 'center',
  },
  postBtnText: { fontSize: 14, fontWeight: '700' },
  scrollContent: { padding: 18, gap: 2 },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  authorName: { fontSize: 15, fontWeight: '600' },
  authorHandle: { fontSize: 12, marginTop: 1 },
  section: { marginBottom: 16 },
  sectionLabel: { fontSize: 11.5, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 },
  typeRow: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 3,
    gap: 3,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: 'center',
  },
  typeBtnText: { fontSize: 13, fontWeight: '600' },
  catChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  catChipText: { fontSize: 13, fontWeight: '500' },
  titleInput: {
    fontSize: 22,
    fontWeight: '700',
    paddingBottom: 12,
    borderBottomWidth: 1,
    lineHeight: 30,
  },
  bodyInput: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    fontSize: 15,
    minHeight: 130,
    lineHeight: 23,
  },
  charCounter: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 6,
    fontWeight: '500',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  toolbarBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbarBtnText: { fontSize: 15 },
  toolbarEmoji: { fontSize: 18 },
  toolbarDivider: { width: 1, height: 22, marginHorizontal: 2 },
  suggestBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestBtnText: { fontSize: 12.5, fontWeight: '600' },
  imagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  imagePreviewText: { fontSize: 14 },
  imageRemove: { fontSize: 13, fontWeight: '600' },
  suggestionsCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  suggestionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    padding: 12,
    paddingBottom: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  suggestionText: { fontSize: 14, flex: 1, marginRight: 8, lineHeight: 20 },
  pollCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  pollTitle: { fontSize: 16, fontWeight: '700' },
  pollSubLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  pollQuestionInput: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  pollOptionRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pollOptionInput: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
  },
  pollRemoveBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pollRemoveBtnText: { fontSize: 13, fontWeight: '700' },
  addOptionBtn: {
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  addOptionText: { fontSize: 14, fontWeight: '600' },
  durationRow: { flexDirection: 'row', gap: 8 },
  durationBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  durationBtnText: { fontSize: 13, fontWeight: '600' },
  hashtagInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
});
