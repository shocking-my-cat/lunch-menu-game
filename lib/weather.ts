export type WeatherInfo = {
  condition: "rainy" | "snowy" | "hot" | "cold" | "clear"
  label: string
  emoji: string
  temp?: number
}

export async function fetchCurrentWeather(): Promise<WeatherInfo> {
  if (typeof window === "undefined" || !("geolocation" in navigator)) {
    return { condition: "clear", label: "맑고 쾌적함", emoji: "☀️" }
  }

  return new Promise((resolve) => {
    // 3초 타임아웃으로 빠른 폴백
    const timeout = setTimeout(() => {
      resolve({ condition: "clear", label: "맑음", emoji: "☀️" })
    }, 3000)

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        clearTimeout(timeout)
        try {
          const lat = pos.coords.latitude
          const lon = pos.coords.longitude
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
          )
          if (!res.ok) throw new Error("Weather API Error")
          const data = await res.json()
          const code = data.current_weather?.weathercode ?? 0
          const temp = data.current_weather?.temperature ?? 20

          let condition: WeatherInfo["condition"] = "clear"
          let label = "맑고 상쾌함"
          let emoji = "☀️"

          if (code >= 51 && code <= 99) {
            if (code >= 71 && code <= 77) {
              condition = "snowy"
              label = "눈 내리는 날"
              emoji = "❄️"
            } else {
              condition = "rainy"
              label = "비 오는 날"
              emoji = "🌧️"
            }
          } else if (temp >= 28) {
            condition = "hot"
            label = "무더운 날씨"
            emoji = "🫠"
          } else if (temp <= 5) {
            condition = "cold"
            label = "쌀쌀한 추위"
            emoji = "🥶"
          }

          resolve({ condition, label, emoji, temp })
        } catch {
          resolve({ condition: "clear", label: "맑음", emoji: "☀️" })
        }
      },
      () => {
        clearTimeout(timeout)
        // 위치 권한 거부 시 기본값 반환
        resolve({ condition: "clear", label: "맑음", emoji: "☀️" })
      },
      { timeout: 3000 }
    )
  })
}
