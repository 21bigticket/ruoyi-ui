function normalizeDateValue(value) {
  if (value === undefined || value === null || value === "") {
    return undefined
  }
  if (typeof value === "number") {
    return value > 9999999999 ? Math.floor(value / 1000) : value
  }
  if (value instanceof Date) {
    return Math.floor(value.getTime() / 1000)
  }
  const parsed = new Date(value).getTime()
  if (Number.isNaN(parsed)) {
    return undefined
  }
  return Math.floor(parsed / 1000)
}

export function toUnixTimestamp(value) {
  return normalizeDateValue(value)
}

export function extractTimeRange(query = {}) {
  const range = query.dateRange || query.timeRange || []
  const start = query.startTime ?? query.params?.beginTime ?? range[0]
  const end = query.endTime ?? query.params?.endTime ?? range[1]

  return {
    start_time: toUnixTimestamp(start),
    end_time: toUnixTimestamp(end)
  }
}
