const ADMIN_SUBDOMAIN = "admin"
const USER_SUBDOMAIN = "user"

const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "")

const isIpAddress = (hostname = "") => /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)

const replaceSubdomain = (origin, sourceSubdomain, targetSubdomain) => {
  if (!origin) {
    return ""
  }

  try {
    const url = new URL(origin)

    if (url.hostname === "localhost" || isIpAddress(url.hostname)) {
      return trimTrailingSlash(url.origin)
    }

    if (url.hostname === sourceSubdomain) {
      url.hostname = targetSubdomain
      return trimTrailingSlash(url.origin)
    }

    const sourcePrefix = `${sourceSubdomain}.`

    if (url.hostname.startsWith(sourcePrefix)) {
      url.hostname = `${targetSubdomain}.${url.hostname.slice(sourcePrefix.length)}`
    }

    return trimTrailingSlash(url.origin)
  } catch {
    return trimTrailingSlash(origin)
  }
}

const parseUserPayload = (rawUser) => {
  if (!rawUser) {
    return null
  }

  const parsers = [
    () => JSON.parse(rawUser),
    () => JSON.parse(decodeURIComponent(rawUser)),
    () => JSON.parse(atob(rawUser)),
    () => JSON.parse(atob(rawUser.replace(/-/g, "+").replace(/_/g, "/")))
  ]

  for (const parser of parsers) {
    try {
      const user = parser()

      if (user && typeof user === "object") {
        return user
      }
    } catch {
      continue
    }
  }

  return null
}

const currentOrigin = typeof window !== "undefined" ? trimTrailingSlash(window.location.origin) : ""

const resolveOrigin = (value) => {
  try {
    return new URL(value).origin
  } catch {
    return ""
  }
}

export const ADMIN_API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_BASE_URL || ""
)

export const BACKEND_ORIGIN = resolveOrigin(ADMIN_API_BASE_URL)

export const ADMIN_AUTH_API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_ADMIN_AUTH_API_BASE_URL || `${BACKEND_ORIGIN}/api/admin`
)

export const ADMIN_APP_URL = trimTrailingSlash(import.meta.env.VITE_ADMIN_APP_URL || currentOrigin)

export const USER_APP_URL = trimTrailingSlash(
  import.meta.env.VITE_USER_APP_URL || replaceSubdomain(ADMIN_APP_URL, ADMIN_SUBDOMAIN, USER_SUBDOMAIN)
)

export const GOOGLE_CALLBACK_PATH = "/auth/google/callback"

export const saveAuthSession = ({ token, role, user }) => {
  if (!token) {
    return
  }

  localStorage.setItem("token", token)
  localStorage.setItem("role", role || user?.role || "admin")

  if (user) {
    localStorage.setItem("user", JSON.stringify(user))
  }
}

export const clearAuthSession = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("role")
  localStorage.removeItem("user")
}

export const redirectToUserApp = (path = "/login") => {
  if (typeof window === "undefined" || !USER_APP_URL) {
    return
  }

  const targetUrl = new URL(path, `${USER_APP_URL}/`)
  window.location.replace(targetUrl.toString())
}

export const buildAdminGoogleLoginUrl = () => {
  const loginUrl = new URL(`${ADMIN_AUTH_API_BASE_URL}/google/redirect`)

  if (ADMIN_APP_URL) {
    loginUrl.searchParams.set("redirect_url", `${ADMIN_APP_URL}${GOOGLE_CALLBACK_PATH}`)
  }

  loginUrl.searchParams.set("role", "admin")
  loginUrl.searchParams.set("source", "admin")

  return loginUrl.toString()
}

export const getGoogleCallbackSession = (searchParams) => {
  const user = parseUserPayload(
    searchParams.get("user") || searchParams.get("user_data") || searchParams.get("user_json")
  )

  return {
    token: searchParams.get("token") || searchParams.get("access_token") || searchParams.get("api_token"),
    role: user?.role || searchParams.get("role") || "admin",
    user,
    error: searchParams.get("error") || searchParams.get("message") || ""
  }
}

const parseApiJson = async (response) => {
  try {
    return await response.json()
  } catch {
    return {}
  }
}

const getAuthUserFromResponse = (payload) => payload?.data?.user || payload?.user || null

const getAuthTokenFromResponse = (payload) => payload?.data?.token || payload?.token || ""

export const loginAdminWithPassword = async ({ email, password }) => {
  const response = await fetch(`${ADMIN_AUTH_API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ email, password })
  })

  const payload = await parseApiJson(response)

  if (!response.ok) {
    throw new Error(payload?.message || "Login admin gagal")
  }

  return {
    token: getAuthTokenFromResponse(payload),
    user: getAuthUserFromResponse(payload)
  }
}

export const fetchAdminProfile = async (token) => {
  if (!token) {
    throw new Error("Token admin tidak ditemukan.")
  }

  const response = await fetch(`${ADMIN_AUTH_API_BASE_URL}/me`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    }
  })

  const payload = await parseApiJson(response)

  if (!response.ok) {
    throw new Error(payload?.message || "Sesi admin tidak valid.")
  }

  const user = getAuthUserFromResponse(payload)

  if (!user) {
    throw new Error("Data admin dari server tidak ditemukan.")
  }

  return user
}
