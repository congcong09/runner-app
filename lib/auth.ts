"use client"

import { useSyncExternalStore } from "react"

/**
 * 本地演示账户。
 *
 * 这里刻意只做 localStorage，不发任何网络请求。以后接入 Strava / Garmin /
 * COROS 等平台时，只需要把 createSession / clearSession 换成真实 OAuth 结果，
 * 页面层不需要重写。
 */

const STORAGE_KEY = "stride-lab-session-v1"
const AUTH_EVENT = "stride-auth-change"

export interface AuthSession {
  id: string
  name: string
  email: string
  provider: "local"
  createdAt: string
}

let cachedRaw: string | null | undefined
let cachedSession: AuthSession | null = null
let memorySession: AuthSession | null = null

function parseSession(raw: string | null): AuthSession | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<AuthSession>
    if (
      typeof parsed.id !== "string" ||
      typeof parsed.email !== "string" ||
      typeof parsed.name !== "string"
    ) {
      return null
    }
    return {
      id: parsed.id,
      name: parsed.name,
      email: parsed.email,
      provider: "local",
      createdAt:
        typeof parsed.createdAt === "string"
          ? parsed.createdAt
          : new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw === cachedRaw) return cachedSession
    cachedRaw = raw
    cachedSession = parseSession(raw)
    return cachedSession
  } catch {
    return memorySession
  }
}

function notify() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(AUTH_EVENT))
}

export function subscribeAuth(callback: () => void) {
  if (typeof window === "undefined") return () => {}
  const onStorage = (event: StorageEvent) => {
    if (!event.key || event.key === STORAGE_KEY) {
      cachedRaw = undefined
      callback()
    }
  }
  window.addEventListener("storage", onStorage)
  window.addEventListener(AUTH_EVENT, callback)
  return () => {
    window.removeEventListener("storage", onStorage)
    window.removeEventListener(AUTH_EVENT, callback)
  }
}

const serverSnapshot = () => null

export function useAuthSession(): AuthSession | null {
  return useSyncExternalStore(subscribeAuth, getAuthSession, serverSnapshot)
}

function writeSession(session: AuthSession | null) {
  memorySession = session
  cachedSession = session
  cachedRaw = session ? JSON.stringify(session) : null
  try {
    if (session) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } else {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    /* 隐私模式下写入失败时，至少保持当前标签页的内存状态 */
  }
  notify()
}

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `local-${Date.now()}`
}

export function signIn(email: string, name?: string): AuthSession {
  const session: AuthSession = {
    id: makeId(),
    email: email.trim().toLowerCase(),
    name: name?.trim() || email.split("@")[0] || "跑者",
    provider: "local",
    createdAt: new Date().toISOString(),
  }
  writeSession(session)
  return session
}

export function signOut() {
  writeSession(null)
}
