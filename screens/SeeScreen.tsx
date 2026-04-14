import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';

// ─── 색상 / 폰트 ───────────────────────────────────────────────
const C = {
  bg: '#0D1117',
  yellow: '#F5C842',
  text: '#F0EDE6',
  textMuted: '#6B7280',
  card: '#161B22',
  cardBlue: '#1A1F2E',
  border: '#21262D',
  green: '#3FB950',
  teal: '#3ECFB2',
  red: '#F85149',
};
const F = {
  display: 'YesevaOne_400Regular',
  regular: 'DMSans_400Regular',
  medium: 'DMSans_500Medium',
  bold: 'DMSans_700Bold',
};

// ─── 더미 데이터 ───────────────────────────────────────────────
type RoutineFilter = 'done' | 'undone' | 'all';

const ROUTINES = [
  { id: '1', title: '모닝 루틴', subtitle: '기상, 스트레칭, 물 마시기', type: '기본', done: true },
  { id: '2', title: '영어 독해', subtitle: '지문 3개 풀기', type: '활동', done: true },
  { id: '3', title: '수학 미적분', subtitle: '문제 10개 풀기', type: '활동', done: true },
  { id: '4', title: '국어 비문학', subtitle: '지문 분석', type: '활동', done: false },
  { id: '5', title: '운동', subtitle: '30분 러닝', type: '기본', done: false },
  { id: '6', title: '리뷰 & 회고', subtitle: '오늘 복습', type: '기본', done: true },
];

const MOOD_TAGS = ['집중 잘 됐어요', '피곤했어요', '산만했어요', '뿌듯해요', '계획대로'];

const VLOG_CLIPS = [
  { time: '08:00', height: 40 },
  { time: '09:00', height: 55 },
  { time: '10:00', height: 70 },
  { time: '11:00', height: 35 },
  { time: '14:00', height: 25 },
];

// ─── 컴포넌트 ──────────────────────────────────────────────────
interface Props {
  onBack: () => void;
}

export default function SeeScreen({ onBack }: Props) {
  const [filter, setFilter] = useState<RoutineFilter>('done');
  const [selectedMoods, setSelectedMoods] = useState<string[]>(['집중 잘 됐어요', '피곤했어요', '계획대로']);
  const [memo, setMemo] = useState('오늘 수학 집중이 잘 됐다. 내일은 국어도 마무리하자');

  const doneCount = ROUTINES.filter((r) => r.done).length;
  const undoneCount = ROUTINES.filter((r) => !r.done).length;

  const filteredRoutines = ROUTINES.filter((r) => {
    if (filter === 'done') return r.done;
    if (filter === 'undone') return !r.done;
    return true;
  });

  function toggleMood(tag: string) {
    setSelectedMoods((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* ── 헤더 ──────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>오늘의 기록</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 타이틀 ────────────────────────────────────────── */}
        <Text style={styles.pageTitle}>See</Text>
        <Text style={styles.pageSubtitle}>오늘을 돌아보세요</Text>

        <View style={styles.divider} />

        {/* ── 스탯 카드 3개 ──────────────────────────────────── */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: C.teal }]}>6h</Text>
            <Text style={styles.statLabel}>총 시간</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              <Text style={{ color: C.yellow }}>{doneCount}</Text>
              <Text style={[styles.statValue, { color: C.textMuted, fontSize: 14 }]}>/{ROUTINES.length}</Text>
            </Text>
            <Text style={styles.statLabel}>루틴 달성</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: C.yellow }]}>5개</Text>
            <Text style={styles.statLabel}>Do 기록</Text>
          </View>
        </View>

        {/* ── 달성 진행 바 ───────────────────────────────────── */}
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${(doneCount / ROUTINES.length) * 100}%` }]} />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabelDone}>달성 {doneCount}개</Text>
          <Text style={styles.progressLabelUndone}>미달성 {undoneCount}개</Text>
        </View>

        {/* ── 루틴 확인 ──────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>루틴 확인</Text>

        {/* 필터 탭 */}
        <View style={styles.filterRow}>
          {(['done', 'undone', 'all'] as RoutineFilter[]).map((f) => {
            const label = f === 'done' ? `달성 ${doneCount}` : f === 'undone' ? `미달성 ${undoneCount}` : `전체 ${ROUTINES.length}`;
            return (
              <TouchableOpacity
                key={f}
                style={[styles.filterTab, filter === f && styles.filterTabActive]}
                onPress={() => setFilter(f)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 루틴 카드 목록 */}
        <View style={styles.routineList}>
          {filteredRoutines.map((r) => (
            <View key={r.id} style={styles.routineCard}>
              <View style={[styles.routineCheck, r.done && styles.routineCheckDone]}>
                {r.done && <Text style={styles.routineCheckIcon}>✓</Text>}
              </View>
              <View style={styles.routineInfo}>
                <Text style={styles.routineTitle}>{r.title}</Text>
                <Text style={styles.routineSubtitle}>{r.subtitle}</Text>
              </View>
              <View style={styles.routineTypeBadge}>
                <Text style={styles.routineTypeText}>{r.type}</Text>
                <Text style={styles.routineTypeText}>  </Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── 오늘 어땠나요 ──────────────────────────────────── */}
        <Text style={styles.sectionLabel}>오늘 어땠나요?</Text>
        <View style={styles.moodGrid}>
          {MOOD_TAGS.map((tag) => {
            const active = selectedMoods.includes(tag);
            return (
              <TouchableOpacity
                key={tag}
                style={[styles.moodTag, active && styles.moodTagActive]}
                onPress={() => toggleMood(tag)}
                activeOpacity={0.7}
              >
                <Text style={[styles.moodTagText, active && styles.moodTagTextActive]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── 한 줄 메모 ─────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>한 줄 메모 (선택)</Text>
        <TextInput
          style={styles.memoInput}
          value={memo}
          onChangeText={setMemo}
          multiline
          placeholder="오늘 하루를 한 줄로 기록해보세요"
          placeholderTextColor={C.textMuted}
        />

        {/* ── 오늘의 브이로그 ────────────────────────────────── */}
        <Text style={styles.sectionLabel}>오늘의 브이로그</Text>
        <View style={styles.vlogCard}>
          <View style={styles.vlogTimeline}>
            {VLOG_CLIPS.map((clip, i) => (
              <View key={i} style={styles.vlogClipCol}>
                <View style={[styles.vlogBar, { height: clip.height }]} />
                <Text style={styles.vlogTime}>{clip.time}</Text>
              </View>
            ))}
          </View>
          <View style={styles.vlogFooter}>
            <Text style={styles.vlogMeta}>5개 클립 · 총 40초</Text>
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>AI편집 완료</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* ── 하루 완료 버튼 ─────────────────────────────────── */}
      <View style={styles.ctaSection}>
        <TouchableOpacity style={styles.ctaButton} activeOpacity={0.85}>
          <Text style={styles.ctaText}>오늘 하루 완료</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── 스타일 ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },

  // 헤더
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 12,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: C.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 18, color: C.text },
  headerTitle: { fontFamily: F.medium, fontSize: 15, color: C.textMuted },

  // 스크롤
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },

  // 타이틀
  pageTitle: { fontFamily: F.display, fontSize: 40, color: C.text, marginTop: 8 },
  pageSubtitle: { fontFamily: F.regular, fontSize: 14, color: C.textMuted, marginTop: 4 },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 20 },

  // 스탯 카드
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1,
    backgroundColor: C.card,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 4,
  },
  statValue: { fontFamily: F.bold, fontSize: 22, color: C.text },
  statLabel: { fontFamily: F.regular, fontSize: 11, color: C.textMuted },

  // 진행 바
  progressBarBg: {
    height: 6,
    backgroundColor: C.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: { height: '100%', backgroundColor: C.green, borderRadius: 3 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  progressLabelDone: { fontFamily: F.medium, fontSize: 12, color: C.green },
  progressLabelUndone: { fontFamily: F.medium, fontSize: 12, color: C.red },

  // 섹션 라벨
  sectionLabel: {
    fontFamily: F.medium,
    fontSize: 11,
    color: C.textMuted,
    letterSpacing: 1.2,
    marginBottom: 10,
  },

  // 필터 탭
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: C.card,
  },
  filterTabActive: { backgroundColor: C.teal + '30', borderWidth: 1, borderColor: C.teal },
  filterTabText: { fontFamily: F.medium, fontSize: 12, color: C.textMuted },
  filterTabTextActive: { color: C.teal },

  // 루틴 카드
  routineList: { gap: 8, marginBottom: 24 },
  routineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.cardBlue,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  routineCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routineCheckDone: { backgroundColor: C.teal, borderColor: C.teal },
  routineCheckIcon: { color: '#fff', fontSize: 12, fontWeight: '700' },
  routineInfo: { flex: 1 },
  routineTitle: { fontFamily: F.bold, fontSize: 15, color: C.text },
  routineSubtitle: { fontFamily: F.regular, fontSize: 12, color: C.textMuted, marginTop: 2 },
  routineTypeBadge: {
    backgroundColor: '#1E2A3A',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  routineTypeText: { fontFamily: F.medium, fontSize: 10, color: C.textMuted },

  // 무드 태그
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  moodTag: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
  },
  moodTagActive: { backgroundColor: '#2A2000', borderColor: C.yellow },
  moodTagText: { fontFamily: F.medium, fontSize: 13, color: C.textMuted },
  moodTagTextActive: { color: C.yellow },

  // 메모 입력
  memoInput: {
    backgroundColor: C.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
    fontFamily: F.regular,
    fontSize: 14,
    color: C.text,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 24,
  },

  // 브이로그 카드
  vlogCard: {
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
  },
  vlogTimeline: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    height: 90,
    marginBottom: 12,
  },
  vlogClipCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 6 },
  vlogBar: {
    width: '100%',
    backgroundColor: C.cardBlue,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: C.border,
  },
  vlogTime: { fontFamily: F.regular, fontSize: 9, color: C.textMuted },
  vlogFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  vlogMeta: { fontFamily: F.regular, fontSize: 12, color: C.textMuted },
  aiBadge: {
    backgroundColor: C.yellow + '20',
    borderWidth: 1,
    borderColor: C.yellow + '60',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  aiBadgeText: { fontFamily: F.bold, fontSize: 11, color: C.yellow },

  // CTA
  ctaSection: { paddingHorizontal: 20, paddingBottom: 12, paddingTop: 8 },
  ctaButton: {
    backgroundColor: C.yellow,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  ctaText: { fontFamily: F.bold, fontSize: 18, color: C.bg },
});
