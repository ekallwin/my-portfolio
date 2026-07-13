import * as React from "react"
import { X, CircleCheck, AlertCircle, AlertTriangle, Info, Loader2 } from "lucide-react"

type NotificationType = "success" | "error" | "warning" | "info" | "loading"
type NotificationPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center"

interface Notification {
  id: string
  type: NotificationType
  title: string
  description?: string
  duration?: number
}

/* ------------------------------------------------------------------ */
/*  Global store — lets `toast.success()` etc. be called from ANY     */
/*  file (event handlers, async functions, outside React) exactly     */
/*  like react-hot-toast, without needing a Context provider.         */
/* ------------------------------------------------------------------ */

type Listener = () => void

let notifications: Notification[] = []
const listeners = new Set<Listener>()

function emitChange() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: Listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return notifications
}

function genId() {
  return Math.random().toString(36).substring(2, 9)
}

function scheduleDismiss(id: string, duration?: number, type?: NotificationType) {
  if (duration === 0 || type === "loading") return
  setTimeout(() => removeNotification(id), duration ?? 5000)
}

function addNotification(notification: Omit<Notification, "id"> & { id?: string }) {
  const id = notification.id || genId()
  notifications = [...notifications, { ...notification, id }]
  emitChange()
  scheduleDismiss(id, notification.duration, notification.type)
  return id
}

function updateNotification(id: string, updates: Partial<Omit<Notification, "id">>) {
  let next: Notification | undefined
  notifications = notifications.map((n) => {
    if (n.id !== id) return n
    next = { ...n, ...updates }
    return next
  })
  emitChange()
  if (next) scheduleDismiss(id, next.duration, next.type)
}

function removeNotification(id: string) {
  notifications = notifications.filter((n) => n.id !== id)
  emitChange()
}

function dismissAll() {
  notifications = []
  emitChange()
}

function useNotificationStore() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

/* ------------------------------------------------------------------ */
/*  Imperative `toast` API — drop-in replacement for react-hot-toast  */
/* ------------------------------------------------------------------ */

interface ToastOptions {
  description?: string
  duration?: number
  id?: string
}

type PromiseMessages<T> = {
  loading: string
  success: string | ((data: T) => string)
  error: string | ((err: unknown) => string)
}

function normalize(type: NotificationType, title: string, opts?: ToastOptions) {
  return {
    id: opts?.id,
    type,
    title,
    description: opts?.description,
    duration: opts?.duration,
  }
}

export const toast = {
  success: (title: string, opts?: ToastOptions) => addNotification(normalize("success", title, opts)),
  error: (title: string, opts?: ToastOptions) => addNotification(normalize("error", title, opts)),
  warning: (title: string, opts?: ToastOptions) => addNotification(normalize("warning", title, opts)),
  info: (title: string, opts?: ToastOptions) => addNotification(normalize("info", title, opts)),
  loading: (title: string, opts?: ToastOptions) =>
    addNotification({ ...normalize("loading", title, opts), duration: 0 }),
  dismiss: (id?: string) => (id ? removeNotification(id) : dismissAll()),
  promise: <T,>(promise: Promise<T>, msgs: PromiseMessages<T>, opts?: ToastOptions): Promise<T> => {
    const id = addNotification({ ...normalize("loading", msgs.loading, opts), duration: 0 })
    promise
      .then((data) => {
        const message = typeof msgs.success === "function" ? msgs.success(data) : msgs.success
        updateNotification(id, { type: "success", title: message, duration: opts?.duration ?? 5000 })
      })
      .catch((err) => {
        const message = typeof msgs.error === "function" ? msgs.error(err) : msgs.error
        updateNotification(id, { type: "error", title: message, duration: opts?.duration ?? 5000 })
      })
    return promise
  },
}

/* ------------------------------------------------------------------ */
/*  Context-based API (kept for backwards compatibility)              */
/* ------------------------------------------------------------------ */

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id">) => void
  removeNotification: (id: string) => void
}

const NotificationContext = React.createContext<NotificationContextType | null>(null)

export function useNotification() {
  const context = React.useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotification must be used within a GlassNotificationProvider")
  }
  return context
}

export function GlassNotificationProvider({
  children,
  position = "bottom-right",
}: {
  children: React.ReactNode
  position?: NotificationPosition
}) {
  const storeNotifications = useNotificationStore()

  const contextValue = React.useMemo<NotificationContextType>(
    () => ({
      notifications: storeNotifications,
      addNotification,
      removeNotification,
    }),
    [storeNotifications],
  )

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <GlassNotificationContainer position={position} />
    </NotificationContext.Provider>
  )
}

/**
 * Standalone toast host — the Glass UI equivalent of react-hot-toast's
 * `<Toaster />`. Drop it once anywhere in the tree (no provider needed)
 * and call `toast.success()` / `toast.error()` / `toast.promise()` etc.
 * from anywhere in the app.
 */
export function GlassToaster({ position = "top-center" }: { position?: NotificationPosition }) {
  return <GlassNotificationContainer position={position} />
}

/* ------------------------------------------------------------------ */
/*  Visual config — plain values, no Tailwind gradient/blur utilities */
/*  so this always renders correctly regardless of Tailwind version   */
/*  or whether this file is inside the content-scan glob.             */
/* ------------------------------------------------------------------ */

type TypeStyle = {
  icon: typeof CircleCheck
  accent: string // solid accent color (icon, progress bar, border)
  tintFrom: string // gradient tint start (rgba)
  tintTo: string // gradient tint end (rgba)
  glow: string // outer glow rgba
  spin?: boolean
}

const typeConfig: Record<NotificationType, TypeStyle> = {
  success: {
    icon: CircleCheck,
    accent: "#34d399",
    tintFrom: "rgba(16,185,129,0.28)",
    tintTo: "rgba(5,150,105,0.10)",
    glow: "rgba(16,185,129,0.35)",
  },
  error: {
    icon: AlertCircle,
    accent: "#f87171",
    tintFrom: "rgba(239,68,68,0.30)",
    tintTo: "rgba(190,18,60,0.10)",
    glow: "rgba(239,68,68,0.35)",
  },
  warning: {
    icon: AlertTriangle,
    accent: "#fbbf24",
    tintFrom: "rgba(245,158,11,0.28)",
    tintTo: "rgba(217,119,6,0.10)",
    glow: "rgba(245,158,11,0.35)",
  },
  info: {
    icon: Info,
    accent: "#22d3ee",
    tintFrom: "rgba(6,182,212,0.28)",
    tintTo: "rgba(8,145,178,0.10)",
    glow: "rgba(6,182,212,0.35)",
  },
  loading: {
    icon: Loader2,
    accent: "#a78bfa",
    tintFrom: "rgba(139,92,246,0.28)",
    tintTo: "rgba(109,40,217,0.10)",
    glow: "rgba(139,92,246,0.35)",
    spin: true,
  },
}

const positionStyles: Record<NotificationPosition, React.CSSProperties> = {
  "top-right": { top: 16, right: 16, alignItems: "flex-end" },
  "top-left": { top: 16, left: 16, alignItems: "flex-start" },
  "bottom-right": { bottom: 16, right: 16, alignItems: "flex-end" },
  "bottom-left": { bottom: 16, left: 16, alignItems: "flex-start" },
  "top-center": { top: 16, left: "50%", transform: "translateX(-50%)", alignItems: "center" },
  "bottom-center": { bottom: 16, left: "50%", transform: "translateX(-50%)", alignItems: "center" },
}

/* Inject keyframes + hover rules once */
const STYLE_TAG_ID = "glass-toast-keyframes"
function ensureStylesInjected() {
  if (typeof document === "undefined" || document.getElementById(STYLE_TAG_ID)) return
  const style = document.createElement("style")
  style.id = STYLE_TAG_ID
  style.textContent = `
@keyframes glassToastIn {
  from { opacity: 0; transform: translateY(-8px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes glassToastSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.glass-toast-close:hover {
  background: rgba(255,255,255,0.14) !important;
  color: #fff !important;
}
`
  document.head.appendChild(style)
}

function GlassNotificationContainer({ position = "bottom-right" }: { position?: NotificationPosition }) {
  const items = useNotificationStore()

  React.useEffect(() => {
    ensureStylesInjected()
  }, [])

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        maxWidth: 384,
        width: "calc(100% - 32px)",
        pointerEvents: "none",
        ...positionStyles[position],
      }}
      role="region"
      aria-label="Notifications"
    >
      {items.map((notification, index) => (
        <GlassNotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
          style={{
            transform: `scale(${1 - index * 0.02})`,
            opacity: 1 - index * 0.1,
          }}
        />
      ))}
    </div>
  )
}

interface GlassNotificationItemProps {
  notification: Notification
  onClose: () => void
  style?: React.CSSProperties
}

function GlassNotificationItem({ notification, onClose, style }: GlassNotificationItemProps) {
  const config = typeConfig[notification.type]
  const Icon = config.icon
  const [progress, setProgress] = React.useState(100)
  const duration = notification.duration || 5000
  const isPersistent = notification.duration === 0 || notification.type === "loading"

  React.useEffect(() => {
    if (isPersistent) return

    setProgress(100)
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - 100 / (duration / 100)
        return newProgress <= 0 ? 0 : newProgress
      })
    }, 100)

    return () => clearInterval(interval)
  }, [duration, isPersistent, notification.type, notification.title])

  return (
    <div
      style={{
        pointerEvents: "auto",
        width: "100%",
        animation: "glassToastIn 0.25s ease-out",
        ...style,
      }}
      role="alert"
    >
      <div
        style={{
          position: "relative",
          borderRadius: 14,
          overflow: "hidden",
          border: `1px solid ${config.accent}55`,
          background: `linear-gradient(135deg, ${config.tintFrom}, ${config.tintTo}), rgba(24,24,32,0.55)`,
          backdropFilter: "blur(20px) saturate(160%)",
          WebkitBackdropFilter: "blur(20px) saturate(160%)",
          boxShadow: `0 8px 32px rgba(0,0,0,0.35), 0 0 24px ${config.glow}, inset 0 1px 1px rgba(255,255,255,0.15)`,
        }}
      >
        <div style={{ position: "relative", padding: 16, display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div
            style={{
              flexShrink: 0,
              width: 32,
              height: 32,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.12)",
              background: `linear-gradient(135deg, ${config.tintFrom}, ${config.tintTo})`,
            }}
          >
            <Icon
              size={18}
              color={config.accent}
              style={config.spin ? { animation: "glassToastSpin 0.8s linear infinite" } : undefined}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontWeight: 500, color: "#fff", fontSize: 14, lineHeight: 1.4 }}>
              {notification.title}
            </p>
            {notification.description && (
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.4 }}>
                {notification.description}
              </p>
            )}
          </div>

          {notification.type !== "loading" && (
            <button
              onClick={onClose}
              aria-label="Dismiss notification"
              className="glass-toast-close"
              style={{
                flexShrink: 0,
                padding: 6,
                borderRadius: 8,
                border: "none",
                background: "transparent",
                color: "rgba(255,255,255,0.45)",
                cursor: "pointer",
                display: "flex",
                transition: "background 0.15s ease, color 0.15s ease",
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {!isPersistent && (
          <div style={{ height: 3, background: "rgba(255,255,255,0.08)" }}>
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: config.accent,
                transition: "width 0.1s linear",
              }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// Standalone notification component for demos
export function GlassNotification({
  type = "info",
  title,
  description,
  className,
}: {
  type?: NotificationType
  title: string
  description?: string
  className?: string
}) {
  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <div className={className} style={{ maxWidth: 384 }}>
      <div
        style={{
          position: "relative",
          borderRadius: 14,
          overflow: "hidden",
          border: `1px solid ${config.accent}55`,
          background: `linear-gradient(135deg, ${config.tintFrom}, ${config.tintTo}), rgba(24,24,32,0.55)`,
          backdropFilter: "blur(20px) saturate(160%)",
          WebkitBackdropFilter: "blur(20px) saturate(160%)",
          boxShadow: `0 8px 32px rgba(0,0,0,0.35), 0 0 24px ${config.glow}, inset 0 1px 1px rgba(255,255,255,0.15)`,
        }}
      >
        <div style={{ padding: 16, display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div
            style={{
              flexShrink: 0,
              width: 32,
              height: 32,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.12)",
              background: `linear-gradient(135deg, ${config.tintFrom}, ${config.tintTo})`,
            }}
          >
            <Icon size={18} color={config.accent} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontWeight: 500, color: "#fff", fontSize: 14 }}>{title}</p>
            {description && (
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.65)" }}>{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export { GlassNotificationItem }
export type { NotificationPosition, NotificationType }