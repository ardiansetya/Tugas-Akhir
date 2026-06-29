"use client";

import { useRecentAlerts, useTransits } from "@/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

// Synthesize premium notification sounds using Web Audio API
const playNotificationSound = (type: "error" | "info") => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === "error") {
      // Alarm sound (two rapid beeps)
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.start();
      
      gain.gain.setValueAtTime(0, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime + 0.15);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
      
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.stop(ctx.currentTime + 0.5);
    } else {
      // Soft chime sound
      osc.type = "triangle";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1); // Slide to A5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    }
  } catch (e) {
    // Fail silently if browser blocks audio autoplay before user interaction
  }
};

export default function NotificationListener() {
  const router = useRouter();
  const { data: alerts } = useRecentAlerts();
  const { data: transits } = useTransits();

  const isInitialized = useRef(false);
  const seenAlerts = useRef(new Set<string>());
  const seenTransits = useRef(new Set<string>());

  const translateAlertTitle = (type: string) => {
    const mapping: Record<string, string> = {
      accident: "🚨 Kecelakaan Terdeteksi",
      breakdown: "🚛 Truk Mogok",
      canceled: "❌ Pengiriman Dibatalkan",
      unauthorized_unloading: "⚠️ Bongkar Muatan Ilegal",
      illegal_stop: "🛑 Berhenti Ilegal",
      route_deviation: "🔄 Keluar Rute Resmi",
      fuel_issue: "⛽ Masalah BBM",
      gps_lost: "📡 Sinyal GPS Hilang",
      puncture: "💥 Ban Pecah / Bocor",
    };
    return mapping[type.toLowerCase()] || "⚠️ Peringatan Pengiriman";
  };

  useEffect(() => {
    if (!alerts && !transits) return;

    // First load: populate seen sets to prevent historical notification floods
    if (!isInitialized.current) {
      if (alerts) {
        alerts.forEach((alert) => seenAlerts.current.add(alert.id));
      }
      if (transits) {
        const pending = transits.filter((t) => t.is_accepted === null && !t.actioned_at);
        pending.forEach((t) => seenTransits.current.add(t.id));
      }
      isInitialized.current = true;
      return;
    }

    // Process new alerts
    if (alerts) {
      alerts.forEach((alert) => {
        if (!seenAlerts.current.has(alert.id)) {
          seenAlerts.current.add(alert.id);
          
          playNotificationSound("error");

          const title = translateAlertTitle(alert.type);
          toast.error(title, {
            description: alert.message,
            action: alert.delivery_id ? {
              label: "Lacak",
              onClick: () => router.push(`/pengiriman/tracking/${alert.delivery_id}`),
            } : undefined,
            duration: 8000,
          });
        }
      });
    }

    // Process new transit requests
    if (transits) {
      const pending = transits.filter((t) => t.is_accepted === null && !t.actioned_at);
      pending.forEach((t) => {
        if (!seenTransits.current.has(t.id)) {
          seenTransits.current.add(t.id);

          playNotificationSound("info");

          toast.info("📍 Pengajuan Transit Baru", {
            description: `Driver mengajukan izin transit untuk pengiriman #${t.delivery_id.slice(0, 8)}`,
            action: {
              label: "Buka Transit",
              onClick: () => router.push("/transit-driver"),
            },
            duration: 8000,
          });
        }
      });
    }
  }, [alerts, transits, router]);

  return null;
}
