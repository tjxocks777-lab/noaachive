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
  textMuted: '#8B8985',
  card: '#161B22',
  border: '#21262D',
  done: '#3FB950',
  active: '#F5C842',
  upcoming: '#30363D',
};

// ─── 폰트 ─────────────────────────────────────────────────────
const F = {
  display: 'YesevaOne_400Regular',   // 로고
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
  duration: string;
  status: Status;
}

// ─── 더미 데이터 ───────────────────────────────────────────────
const TODAY_ROUTINES: Routine[] = [
  { id: '1', time: '06:00', title: '기상 & 스트레칭', duration: '15분', status: 'done' },
  { id: '2', time: '06:30', title: '모닝 저널링', duration: '20분', status: 'done' },
  { id: '3', time: '07:00', title: '영어 인풋 듣기', duration: '30분', status: 'active' },
  { id: '4', time: '08:00', title: '심층 학습 블록', duration: '90분', status: 'upcoming' },
  { id: '5', time: '10:00', title: '운동', duration: '60분', status: 'upcoming' },
  { id: '6', time: '14:00', title: '리뷰 & 회고', duration: '30분', status: 'upcoming' },
];

// ─── 유틸 ──────────────────────────────────────────────────────
function getKoreanDate(): string {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const day = days[now.getDay()];
  return `${y}년 ${m}월 ${d}일 ${day}요일`;
}

function getStatusLabel(status: Status): string {
  return status === 'done' ? '완료' : status === 'active' ? '진행 중' : '예정';
}

// ─── 루틴 아이템 ───────────────────────────────────────────────
function RoutineItem({ item }: { item: Routine }) {
  const isActive = item.status === 'active';
  const isDone = item.status === 'done';

  return (
    <View style={[styles.routineItem, isActive && styles.routineItemActive]}>
      {/* 왼쪽 타임라인 */}
      <View style={styles.timelineCol}>
        <Text style={[styles.routineTime, isDone && styles.routineTimeDone]}>
          {item.time}
        </Text>
        <View style={[styles.timelineLine, isDone && styles.timelineLineDone]} />
      </View>

      {/* 상태 아이콘 */}
      <View style={styles.statusCol}>
        {isDone ? (
          <View style={styles.statusDone}>
            <Text style={styles.statusDoneIcon}>✓</Text>
          </View>
        ) : isActive ? (
          <View style={styles.statusActive}>
            <View style={styles.statusActiveDot} />
          </View>
        ) : (
          <View style={styles.statusUpcoming} />
        )}
      </View>

      {/* 컨텐츠 */}
      <View style={styles.routineContent}>
        <View style={styles.routineHeader}>
          <Text
            style={[
              styles.routineTitle,
              isDone && styles.routineTitleDone,
              isActive && styles.routineTitleActive,
            ]}
          >
            {item.title}
          </Text>
          <View
            style={[
              styles.statusBadge,
              isDone && styles.statusBadgeDone,
              isActive && styles.statusBadgeActive,
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                isDone && styles.statusBadgeTextDone,
                isActive && styles.statusBadgeTextActive,
              ]}
            >
              {getStatusLabel(item.status)}
            </Text>
          </View>
        </View>
        <Text style={styles.routineDuration}>{item.duration}</Text>
      </View>
    </View>
  );
}

// ─── 하단 네비게이션 ───────────────────────────────────────────
function BottomNav({ active }: { active: string }) {
  const tabs = [
    { key: 'home', label: '홈', icon: '⌂' },
    { key: 'do', label: 'Do', icon: '◎' },
    { key: 'vlog', label: '브이로그', icon: '▶' },
    { key: 'me', label: '나', icon: '◉' },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <TouchableOpacity key={tab.key} style={styles.navTab} activeOpacity={0.7}>
            <Text style={[styles.navIcon, isActive && styles.navIconActive]}>
              {tab.icon}
            </Text>
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── 메인 화면 ─────────────────────────────────────────────────
export default function HomeScreen() {
  const doneCount = TODAY_ROUTINES.filter((r) => r.status === 'done').length;
  const totalCount = TODAY_ROUTINES.length;
  const progress = Math.round((doneCount / totalCount) * 100);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* ── 상단 헤더 ─────────────────────────────────────── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logoText}>Noa Archive</Text>
          <Text style={styles.dateText}>{getKoreanDate()}</Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakFire}>🔥</Text>
          <Text style={styles.streakCount}>12</Text>
          <Text style={styles.streakUnit}>일</Text>
        </View>
      </View>

      {/* ── 진행률 바 ─────────────────────────────────────── */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>오늘의 Plan</Text>
          <Text style={styles.progressCount}>
            <Text style={styles.progressDone}>{doneCount}</Text>
            <Text style={styles.progressMuted}> / {totalCount} 완료</Text>
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      {/* ── 루틴 목록 ─────────────────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {TODAY_ROUTINES.map((item) => (
          <RoutineItem key={item.id} item={item} />
        ))}
        <View style={styles.scrollPad} />
      </ScrollView>

      {/* ── Do 기록하기 버튼 ───────────────────────────────── */}
      <View style={styles.ctaSection}>
        <TouchableOpacity style={styles.ctaButton} activeOpacity={0.85}>
          <Text style={styles.ctaIcon}>◎</Text>
          <Text style={styles.ctaText}>Do 기록하기</Text>
        </TouchableOpacity>
      </View>

      {/* ── 하단 네비게이션 ────────────────────────────────── */}
      <BottomNav active="home" />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  logoText: {
    fontFamily: F.display,
    fontSize: 26,
    color: C.yellow,
    letterSpacing: 0.5,
  },
  dateText: {
    fontFamily: F.regular,
    fontSize: 12,
    color: C.textMuted,
    marginTop: 3,
    letterSpacing: 0.3,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.yellow,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 3,
  },
  streakFire: {
    fontSize: 14,
  },
  streakCount: {
    fontFamily: F.bold,
    fontSize: 18,
    color: C.yellow,
  },
  streakUnit: {
    fontFamily: F.medium,
    fontSize: 12,
    color: C.yellow,
  },

  // 진행률
  progressSection: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontFamily: F.bold,
    fontSize: 15,
    color: C.text,
    letterSpacing: 0.3,
  },
  progressCount: {
    fontSize: 13,
  },
  progressDone: {
    fontFamily: F.bold,
    color: C.yellow,
    fontSize: 13,
  },
  progressMuted: {
    fontFamily: F.regular,
    color: C.textMuted,
    fontSize: 13,
  },
  progressBar: {
    height: 4,
    backgroundColor: C.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: C.yellow,
    borderRadius: 2,
  },

  // 스크롤
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  scrollPad: {
    height: 20,
  },

  // 루틴 아이템
  routineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  routineItemActive: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.yellow + '40',
  },

  // 타임라인
  timelineCol: {
    width: 44,
    alignItems: 'center',
  },
  routineTime: {
    fontFamily: F.medium,
    fontSize: 11,
    color: C.textMuted,
    marginBottom: 4,
  },
  routineTimeDone: {
    opacity: 0.4,
  },
  timelineLine: {
    width: 1,
    height: 20,
    backgroundColor: C.border,
    marginTop: 2,
  },
  timelineLineDone: {
    backgroundColor: C.done + '60',
  },

  // 상태 아이콘
  statusCol: {
    width: 28,
    alignItems: 'center',
    paddingTop: 1,
  },
  statusDone: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: C.done,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDoneIcon: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  statusActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: C.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusActiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.yellow,
  },
  statusUpcoming: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.upcoming,
  },

  // 루틴 컨텐츠
  routineContent: {
    flex: 1,
    paddingLeft: 10,
  },
  routineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  routineTitle: {
    fontFamily: F.medium,
    fontSize: 15,
    color: C.textMuted,
    flex: 1,
  },
  routineTitleDone: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  routineTitleActive: {
    fontFamily: F.bold,
    color: C.text,
  },
  routineDuration: {
    fontFamily: F.regular,
    fontSize: 12,
    color: C.textMuted,
    marginTop: 2,
    opacity: 0.7,
  },

  // 상태 뱃지
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: C.upcoming,
  },
  statusBadgeDone: {
    backgroundColor: C.done + '25',
  },
  statusBadgeActive: {
    backgroundColor: C.yellow + '25',
  },
  statusBadgeText: {
    fontFamily: F.medium,
    fontSize: 10,
    color: C.textMuted,
  },
  statusBadgeTextDone: {
    color: C.done,
  },
  statusBadgeTextActive: {
    color: C.yellow,
  },

  // CTA 버튼
  ctaSection: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 8,
  },
  ctaButton: {
    backgroundColor: C.yellow,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaIcon: {
    fontSize: 18,
    color: C.bg,
  },
  ctaText: {
    fontFamily: F.bold,
    fontSize: 17,
    color: C.bg,
    letterSpacing: 0.5,
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
    fontSize: 20,
    color: C.textMuted,
  },
  navIconActive: {
    color: C.yellow,
  },
  navLabel: {
    fontFamily: F.medium,
    fontSize: 10,
    color: C.textMuted,
    marginTop: 3,
  },
  navLabelActive: {
    fontFamily: F.bold,
    color: C.yellow,
  },
});
