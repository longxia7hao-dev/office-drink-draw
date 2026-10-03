import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import jsQR from "jsqr";

export function inviteUrl(code: string): string {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("room", code);
  return url.toString();
}

export function roomFromScan(text: string): string | null {
  const raw = text.trim();
  try {
    const room = new URL(raw).searchParams.get("room");
    if (room) {
      const code = room.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
      if (code.length >= 4) return code;
    }
  } catch {
    /* not a url */
  }
  const code = raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
  return code.length >= 4 ? code : null;
}

export function QrCard({ code }: { code: string }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    let live = true;
    void QRCode.toDataURL(inviteUrl(code), {
      margin: 1,
      width: 280,
      errorCorrectionLevel: "M",
      color: { dark: "#14110e", light: "#fff6c2" },
    }).then((url) => {
      if (live) setSrc(url);
    });
    return () => {
      live = false;
    };
  }, [code]);
  return (
    <div className="qr-card">
      <p className="qr-kicker">掃這個進房</p>
      {src ? <img className="qr-img" src={src} alt={`房間 ${code} 的 QR code`} /> : <div className="qr-img" />}
      <strong className="qr-code">{code}</strong>
      <p className="hint">用手機相機一掃，就會打開加入頁。已經在遊戲裡的人也可以按「掃描 QR」。</p>
    </div>
  );
}

export function QrScanner({
  onCode,
  onClose,
}: {
  onCode: (code: string) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onCodeRef = useRef(onCode);
  onCodeRef.current = onCode;
  const [err, setErr] = useState("");

  useEffect(() => {
    let stop = false;
    let raf = 0;
    const streamRef: { current: MediaStream | null } = { current: null };
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const video = videoRef.current;
    if (!video || !navigator.mediaDevices?.getUserMedia) {
      setErr("這台手機開不了相機，請改手打房號。");
      return;
    }
    void (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { facingMode: { ideal: "environment" } },
        });
        streamRef.current = stream;
        if (stop) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        video.srcObject = stream;
        video.muted = true;
        video.playsInline = true;
        await video.play();
      } catch {
        if (!stop) setErr("沒有相機權限。請允許相機，或改手打房號。");
        return;
      }
      const tick = () => {
        if (stop) return;
        if (ctx && video.readyState >= 2 && video.videoWidth > 0) {
          const w = video.videoWidth;
          const h = video.videoHeight;
          canvas.width = w;
          canvas.height = h;
          ctx.drawImage(video, 0, 0, w, h);
          const img = ctx.getImageData(0, 0, w, h);
          const hit = jsQR(img.data, img.width, img.height, { inversionAttempts: "dontInvert" });
          const code = hit?.data ? roomFromScan(hit.data) : null;
          if (code) {
            stop = true;
            streamRef.current?.getTracks().forEach((t) => t.stop());
            onCodeRef.current(code);
            return;
          }
        }
        raf = window.requestAnimationFrame(tick);
      };
      raf = window.requestAnimationFrame(tick);
    })();
    return () => {
      stop = true;
      window.cancelAnimationFrame(raf);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div className="qr-scan">
      <p className="qr-kicker">對準房主的 QR</p>
      <video ref={videoRef} className="qr-video" playsInline muted autoPlay />
      {err ? <p className="error-banner">{err}</p> : <p className="hint">掃到房間碼會直接進去</p>}
      <button className="btn btn-ghost" type="button" onClick={onClose}>
        取消掃描
      </button>
    </div>
  );
}
