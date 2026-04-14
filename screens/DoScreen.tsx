import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';

// ─── 색상 / 폰트 ───────────────────────────────────────────────
const C = {
  bg: '#0D1117',
  yellow: '#F5C842',
  yellowDark: '#7A6010',
  text: '#F0EDE6',
  textMuted: '#6B7280',
  card: '#161B22',
  cardBlue: '#1A1F2E',
  border: '#21262D',
  borderYellow: '#F5C842',
  red: '#E53E3E',
  redDark: '#2D1010',
};
const F = {
  display: 'YesevaOne_400Regular',
  regular: 'DMSans_400Regular',
  medium: 'DMSans_500Medium',
  bold: 'DMSans_700Bold',
};

type RecordMode = 'short' | 'timelapse';
type ScreenState = 'ready' | 'countdown' | 'recording';

interface Props {
  onBack: () => void;
}

export default function DoScreen({ onBack }: Props) {
  const [screenState, setScreenState] = useState<ScreenState>('ready');
  const [mode, setMode] = useState<RecordMode>('short');
  const [countdown, setCountdown] = useState(3);
  const [recordSec, setRecordSec] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(47 * 60 + 23); // 더미: 47:23

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // 경과 시간 계속 증가
  useEffect(() => {
    elapsedRef.current = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => { if (elapsedRef.current) clearInterval(elapsedRef.current); };
  }, []);

  // REC 펄스 애니메이션
  useEffect(() => {
    if (screenState === 'recording') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 0.3, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [screenState]);

  function startCountdown() {
    setScreenState('countdown');
    setCountdown(3);
    let c = 3;
    countdownRef.current = setInterval(() => {
      c -= 1;
      if (c <= 0) {
        clearInterval(countdownRef.current!);
        setScreenState('recording');
        setRecordSec(0);
        recordRef.current = setInterval(() => setRecordSec((s) => s + 1), 1000);
      } else {
        setCountdown(c);
      }
    }, 1000);
  }

  function stopRecording() {
    if (recordRef.current) clearInterval(recordRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    setScreenState('ready');
    setRecordSec(0);
    setCountdown(3);
  }

  function fmt(sec: number): string {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  const isRecording = screenState === 'recording';
  const isCountdown = screenState === 'countdown';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* ── 카메라 뷰파인더 ────────────────────────────────── */}
      <View style={styles.viewfinder}>
        {/* 코너 마커 */}
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />

        {/* 그리드 (대기 상태에만) */}
        {screenState === 'ready' && (
          <View style={styles.grid} pointerEvents="none">
            {[1, 2].map((i) => (
              <View key={`v${i}`} style={[styles.gridLine, styles.gridLineV, { left: `${(i / 3) * 100}%` }]} />
            ))}
            {[1, 2].map((i) => (
              <View key={`h${i}`} style={[styles.gridLine, styles.gridLineH, { top: `${(i / 3) * 100}%` }]} />
            ))}
          </View>
        )}

        {/* REC 뱃지 */}
        {isRecording && (
          <View style={styles.recBadge}>
            <Animated.View style={[styles.recDot, { opacity: pulseAnim }]} />
            <Text style={styles.recText}>REC</Text>
          </View>
        )}

        {/* 카운트다운 숫자 */}
        {isCountdown && (
          <View style={styles.countdownOverlay}>
            <Text style={styles.countdownNumber}>{countdown}</Text>
            <Text style={styles.countdownLabel}>준비하세요</Text>
          </View>
        )}

        {/* 플레이스홀더 텍스트 */}
        {!isCountdown && (
          <Text style={styles.previewPlaceholder}>
            {isRecording ? '촬영 중' : '카메라 프리뷰'}
          </Text>
        )}
      </View>

      {/* ── 하단 정보 패널 ─────────────────────────────────── */}
      <View style={styles.panel}>
        {/* 시간 뱃지 + 타이머 */}
        <View style={styles.panelTop}>
          <View style={styles.timeBadge}>
            <Text style={styles.timeBadgeText}>10:00 — 11:00</Text>
          </View>
          <View style={styles.timerBox}>
            <Text style={styles.timerLabel}>{isRecording ? '촬영' : '경과'}</Text>
            <Text style={[styles.timerValue, isRecording && styles.timerValueRec]}>
              {isRecording ? `00:${recordSec.toString().padStart(2, '0')}` : fmt(elapsedSec)}
            </Text>
          </View>
        </View>

        {/* 루틴 정보 */}
        <Text style={styles.routineTitle}>수학 미적분</Text>
        <Text style={styles.routineSubtitle}>문제 10개 풀기</Text>

        {/* 진행률 바 */}
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>

        {/* 모드 버튼 */}
        <View style={styles.modeRow}>
          <TouchableOpacity
            style={[styles.modeBtn, mode === 'short' && styles.modeBtnActive]}
            onPress={() => setMode('short')}
            activeOpacity={0.8}
          >
            <Text style={[styles.modeBtnIcon, mode === 'short' && styles.modeBtnIconActive]}>⊙</Text>
            <Text style={[styles.modeBtnLabel, mode === 'short' && styles.modeBtnLabelActive]}>짧은 영상</Text>
            <Text style={[styles.modeBtnSub, mode === 'short' && styles.modeBtnSubActive]}>5~10초</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeBtn, styles.modeBtnBlue, mode === 'timelapse' && styles.modeBtnTimelapseActive]}
            onPress={() => setMode('timelapse')}
            activeOpacity={0.8}
          >
            <Text style={[styles.modeBtnIcon, mode === 'timelapse' && styles.modeBtnIconActive]}>◷</Text>
            <Text style={[styles.modeBtnLabel, mode === 'timelapse' && styles.modeBtnLabelActive]}>타임랩스</Text>
            <Text style={[styles.modeBtnSub, mode === 'timelapse' && styles.modeBtnSubActive]}>자동 촬영</Text>
          </TouchableOpacity>
        </View>

        {/* CTA 버튼 */}
        {screenState === 'ready' && (
          <TouchableOpacity style={styles.ctaReady} onPress={startCountdown} activeOpacity={0.85}>
            <Text style={styles.ctaDot}>●</Text>
            <Text style={styles.ctaReadyText}>지금 기록하기</Text>
          </TouchableOpacity>
        )}
        {screenState === 'countdown' && (
          <View style={styles.ctaCountdown}>
            <Text style={styles.ctaCountdownIcon}>⊙</Text>
            <Text style={styles.ctaCountdownText}>촬영 준비 중...</Text>
          </View>
        )}
        {screenState === 'recording' && (
          <TouchableOpacity style={styles.ctaStop} onPress={stopRecording} activeOpacity={0.85}>
            <Text style={styles.ctaStopIcon}>■</Text>
            <Text style={styles.ctaStopText}>촬영 중단</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

// ─── 스타일 ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },

  // 뷰파인더
  viewfinder: {
    flex: 1,
    backgroundColor: '#0A0D12',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 코너 마커
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: C.yellow,
  },
  cornerTL: { top: 12, left: 12, borderTopWidth: 2, borderLeftWidth: 2 },
  cornerTR: { top: 12, right: 12, borderTopWidth: 2, borderRightWidth: 2 },
  cornerBL: { bottom: 12, left: 12, borderBottomWidth: 2, borderLeftWidth: 2 },
  cornerBR: { bottom: 12, right: 12, borderBottomWidth: 2, borderRightWidth: 2 },

  // 그리드
  grid: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: C.yellow + '18',
  },
  gridLineV: {
    width: 1,
    top: 0,
    bottom: 0,
  },
  gridLineH: {
    height: 1,
    left: 0,
    right: 0,
  },

  // REC 뱃지
  recBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.red,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
  },
  recDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  recText: {
    fontFamily: F.bold,
    fontSize: 12,
    color: '#fff',
    letterSpacing: 1,
  },

  // 카운트다운
  countdownOverlay: {
    alignItems: 'center',
  },
  countdownNumber: {
    fontFamily: F.display,
    fontSize: 96,
    color: C.yellow,
    lineHeight: 100,
  },
  countdownLabel: {
    fontFamily: F.medium,
    fontSize: 14,
    color: C.textMuted,
    marginTop: 8,
  },

  // 프리뷰 플레이스홀더
  previewPlaceholder: {
    fontFamily: F.regular,
    fontSize: 14,
    color: C.textMuted,
    opacity: 0.5,
  },

  // 하단 패널
  panel: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  panelTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  timeBadge: {
    backgroundColor: '#2A2000',
    borderWidth: 1,
    borderColor: C.yellow + '60',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  timeBadgeText: {
    fontFamily: F.medium,
    fontSize: 12,
    color: C.yellow,
  },
  timerBox: {
    alignItems: 'flex-end',
  },
  timerLabel: {
    fontFamily: F.regular,
    fontSize: 11,
    color: C.textMuted,
  },
  timerValue: {
    fontFamily: F.bold,
    fontSize: 28,
    color: C.text,
    letterSpacing: 1,
  },
  timerValueRec: {
    color: C.yellow,
  },

  // 루틴 정보
  routineTitle: {
    fontFamily: F.bold,
    fontSize: 26,
    color: C.text,
    marginBottom: 2,
  },
  routineSubtitle: {
    fontFamily: F.regular,
    fontSize: 13,
    color: C.textMuted,
    marginBottom: 10,
  },

  // 진행률 바
  progressBar: {
    height: 3,
    backgroundColor: C.border,
    borderRadius: 2,
    marginBottom: 14,
    overflow: 'hidden',
  },
  progressFill: {
    width: '60%',
    height: '100%',
    backgroundColor: C.yellow,
    borderRadius: 2,
  },

  // 모드 버튼
  modeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  modeBtn: {
    flex: 1,
    backgroundColor: '#1E1A0A',
    borderWidth: 1,
    borderColor: C.yellow + '40',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 2,
  },
  modeBtnBlue: {
    backgroundColor: C.cardBlue,
    borderColor: '#2A3050',
  },
  modeBtnActive: {
    borderColor: C.yellow,
    backgroundColor: '#2A2000',
  },
  modeBtnTimelapseActive: {
    borderColor: '#4A90D9',
    backgroundColor: '#0D1A2E',
  },
  modeBtnIcon: {
    fontSize: 20,
    color: C.textMuted,
  },
  modeBtnIconActive: {
    color: C.yellow,
  },
  modeBtnLabel: {
    fontFamily: F.medium,
    fontSize: 13,
    color: C.textMuted,
  },
  modeBtnLabelActive: {
    color: C.text,
  },
  modeBtnSub: {
    fontFamily: F.regular,
    fontSize: 10,
    color: C.textMuted,
    opacity: 0.7,
  },
  modeBtnSubActive: {
    color: C.yellow,
    opacity: 1,
  },

  // CTA - 대기
  ctaReady: {
    backgroundColor: C.yellow,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaDot: {
    fontSize: 12,
    color: C.bg,
  },
  ctaReadyText: {
    fontFamily: F.bold,
    fontSize: 17,
    color: C.bg,
  },

  // CTA - 카운트다운
  ctaCountdown: {
    borderWidth: 1.5,
    borderColor: C.yellow,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1A1500',
  },
  ctaCountdownIcon: {
    fontSize: 16,
    color: C.yellow,
  },
  ctaCountdownText: {
    fontFamily: F.bold,
    fontSize: 17,
    color: C.yellow,
  },

  // CTA - 촬영 중단
  ctaStop: {
    backgroundColor: C.redDark,
    borderWidth: 1,
    borderColor: C.red + '60',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaStopIcon: {
    fontSize: 12,
    color: C.red,
  },
  ctaStopText: {
    fontFamily: F.bold,
    fontSize: 17,
    color: C.red,
  },
});
