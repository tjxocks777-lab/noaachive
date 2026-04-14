import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';

// ─── 색상 팔레트 ───────────────────────────────────────────────
const C = {
  bg: '#0D1117',
  yellow: '#F5C842',
  text: '#F0EDE6',
  textMuted: '#6B7280',
  card: '#161B22',
  cardActive: '#1A1F28',
  cardUpcoming: '#13181F',
  border: '#21262D',
  borderActive: '#F5C842',
  done: '#3FB950',
};

// ─── 폰트 ─────────────────────────────────────────────────────
const F = {
  display: 'YesevaOne_400Regular',
  regular: 'DMSans_400Regular',
  medium: 'DMSans_500Medium',
  bold: 'DMSans_700Bold',
};

// ─── 타입 ──────────────────────────────────────────────────────
type Status = 'done' | 'active' | 'upcoming';

interface Routine {
  id: string;
  time: string;
  title: string;
  subtitle: string;
  status: Status;
}

// ─── 더미 데이터 ───────────────────────────────────────────────
const TODAY_ROUTINES: Routine[] = [
  {
    id: '1',
    time: '08:00',
    title: '모닝 루틴',
    subtitle: '기본 루틴 · 기상, 스트레칭, 물 마시기',
    status: 'done',
  },
  {
    id: '2',
    time: '09:00',
    title: '영어 독해',
    subtitle: '활동 루틴 · 지문 3개 풀기',
    status: 'done',
  },
  {
    id: '3',
    time: '10:00',
    title: '수학 미적분',
    subtitle: '활동 루틴 · 문제 10개 풀기',
    status: 'active',
  },
  {
    id: '4',
    time: '11:00',
    title: '국어 비문학',
    subtitle: '활동 루틴 · 지문 분석',
    status: 'upcoming',
  },
];

// ─── 유틸 ──────────────────────────────────────────────────────
function getKoreanDate(): string {
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const day = days[now.getDay()];
  return `${day}, ${m}월 ${d}일`;
}

// ─── 루틴 카드 ────────────────────────────────────────────────
function RoutineCard({ item }: { item: Routine }) {
  const isDone = item.status === 'done';
  const isActive = item.status === 'active';

  return (
    <View
      style={[
        styles.card,
        isDone && styles.cardDone,
        isActive && styles.cardActive,
        !isDone && !isActive && styles.cardUpcoming,
      ]}
    >
      {/* 왼쪽: 시간 + 텍스트 */}
      <View style={styles.cardLeft}>
        <Text style={[styles.cardTime, isActive && styles.cardTimeActive, isDone && styles.cardTimeDone]}>
          {item.time}
        </Text>
        <Text style={[styles.cardTitle, isDone && styles.cardTitleDone, isActive && styles.cardTitleActive]}>
          {item.title}
        </Text>
        <Text style={[styles.cardSubtitle, isDone && styles.cardSubtitleDone]}>
          {item.subtitle}
        </Text>
      </View>

      {/* 오른쪽: 상태 아이콘 */}
      <View style={styles.cardRight}>
        {isDone ? (
          <View style={styles.iconDone}>
            <Text style={styles.iconDoneText}>✓</Text>
          </View>
        ) : isActive ? (
          <View style={styles.iconActive}>
            <View style={styles.iconActiveDot} />
          </View>
        ) : (
          <View style={styles.iconUpcoming} />
        )}
      </View>
    </View>
  );
}

// ─── 하단 네비게이션 ───────────────────────────────────────────
interface BottomNavProps {
  active: string;
  onNavigate: (screen: 'home' | 'do' | 'see') => void;
}

function BottomNav({ active, onNavigate }: BottomNavProps) {
  const tabs = [
    { key: 'plan', label: 'Plan', icon: '☰' },
    { key: 'do', label: 'Do', icon: '◎' },
    { key: 'see', label: 'See', icon: '◈' },
    { key: 'vlog', label: 'Vlog', icon: '▶' },
    { key: 'archive', label: 'Archive', icon: '◻' },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.navTab}
            activeOpacity={0.7}
            onPress={() => {
              if (tab.key === 'do') onNavigate('do');
              else if (tab.key === 'see') onNavigate('see');
            }}
          >
            <Text style={[styles.navIcon, isActive && styles.navIconActive]}>{tab.icon}</Text>
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── 메인 화면 ─────────────────────────────────────────────────
interface HomeProps {
  onNavigate: (screen: 'home' | 'do' | 'see') => void;
}

export default function HomeScreen({ onNavigate }: HomeProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* ── 상단 헤더 ─────────────────────────────────────── */}
      <View style={styles.header}>
        {/* 로고 */}
        <Text style={styles.logo}>
          <Text style={styles.logoNoa}>Noa</Text>
          <Text style={styles.logoArchive}>Archive</Text>
        </Text>

        {/* 날짜 + 스트릭 */}
        <View style={styles.headerBottom}>
          <Text style={styles.dateText}>{getKoreanDate()}</Text>
          <View style={styles.streakBadge}>
            <View style={styles.streakDot} />
            <Text style={styles.streakText}>12일째</Text>
          </View>
        </View>
      </View>

      {/* ── 오늘의 PLAN ───────────────────────────────────── */}
      <Text style={styles.sectionLabel}>오늘의 PLAN</Text>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {TODAY_ROUTINES.map((item) => (
          <RoutineCard key={item.id} item={item} />
        ))}
        <View style={styles.scrollPad} />
      </ScrollView>

      {/* ── Do 기록하기 버튼 ───────────────────────────────── */}
      <View style={styles.ctaSection}>
        <TouchableOpacity style={styles.ctaButton} activeOpacity={0.85} onPress={() => onNavigate('do')}>
          <View style={styles.ctaLeft}>
            <Text style={styles.ctaLabel}>지금 시간</Text>
            <Text style={styles.ctaText}>Do 기록하기</Text>
          </View>
          <View style={styles.ctaArrow}>
            <Text style={styles.ctaArrowText}>→</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* ── 하단 네비게이션 ────────────────────────────────── */}
      <BottomNav active="home" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

// ─── 스타일 ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },

  // 헤더
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 4,
  },
  logo: {
    fontSize: 32,
    letterSpacing: 0.3,
  },
  logoNoa: {
    fontFamily: F.display,
    color: C.yellow,
  },
  logoArchive: {
    fontFamily: F.display,
    color: C.text,
  },
  headerBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dateText: {
    fontFamily: F.medium,
    fontSize: 16,
    color: C.textMuted,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C2128',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    gap: 6,
  },
  streakDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.yellow,
  },
  streakText: {
    fontFamily: F.bold,
    fontSize: 13,
    color: C.yellow,
  },

  // 섹션 라벨
  sectionLabel: {
    fontFamily: F.medium,
    fontSize: 11,
    color: C.textMuted,
    letterSpacing: 1.5,
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 12,
  },

  // 스크롤
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  scrollPad: {
    height: 16,
  },

  // 루틴 카드
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
  },
  cardDone: {
    backgroundColor: C.card,
    borderColor: C.border,
    opacity: 0.6,
  },
  cardActive: {
    backgroundColor: '#1C2030',
    borderColor: C.yellow,
  },
  cardUpcoming: {
    backgroundColor: C.cardUpcoming,
    borderColor: C.border,
  },

  cardLeft: {
    flex: 1,
    gap: 3,
  },
  cardTime: {
    fontFamily: F.medium,
    fontSize: 12,
    color: C.textMuted,
    marginBottom: 2,
  },
  cardTimeActive: {
    color: C.yellow,
  },
  cardTimeDone: {
    color: C.textMuted,
  },
  cardTitle: {
    fontFamily: F.bold,
    fontSize: 18,
    color: C.text,
  },
  cardTitleDone: {
    textDecorationLine: 'line-through',
    color: C.textMuted,
  },
  cardTitleActive: {
    color: C.yellow,
  },
  cardSubtitle: {
    fontFamily: F.regular,
    fontSize: 12,
    color: C.textMuted,
    marginTop: 1,
  },
  cardSubtitleDone: {
    textDecorationLine: 'line-through',
  },

  cardRight: {
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDone: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDoneText: {
    color: C.textMuted,
    fontSize: 13,
  },
  iconActive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: C.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.yellow + '20',
  },
  iconActiveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.yellow,
  },
  iconUpcoming: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#30363D',
  },

  // CTA 버튼
  ctaSection: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 8,
  },
  ctaButton: {
    backgroundColor: C.yellow,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaLeft: {
    gap: 2,
  },
  ctaLabel: {
    fontFamily: F.medium,
    fontSize: 12,
    color: '#7A6010',
  },
  ctaText: {
    fontFamily: F.bold,
    fontSize: 22,
    color: C.bg,
  },
  ctaArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.bg + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaArrowText: {
    fontFamily: F.bold,
    fontSize: 20,
    color: C.bg,
  },

  // 하단 네비게이션
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: C.card,
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingBottom: 8,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  navIcon: {
    fontSize: 18,
    color: C.textMuted,
  },
  navIconActive: {
    color: C.yellow,
  },
  navLabel: {
    fontFamily: F.medium,
    fontSize: 9,
    color: C.textMuted,
    marginTop: 3,
  },
  navLabelActive: {
    fontFamily: F.bold,
    color: C.yellow,
  },
});
