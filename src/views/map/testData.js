export const pointData = [
  ...Array.from({ length: 100 }).map(() => {
    const longitude = 116.404 + Math.random() * 0.01
    const latitude = 39.915 + Math.random() * 0.01
    return {
      longitude,
      latitude,
      value: Math.floor(Math.random() * 100),
      status: ['在线', '离线', '报警', '超速'][Math.floor(Math.random() * 4)],
    }
  })
]