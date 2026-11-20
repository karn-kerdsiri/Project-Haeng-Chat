// รองรับ FR-PRE-05 และ IF-WEB-01 โดยส่งคำขอ POST ไปยัง path ที่ผู้เรียกกำหนด
export async function postJson(path, payload) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (response.status === 204) return null

  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const error = new Error(`คำขอไปยัง ${path} ล้มเหลว`)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

export const post = postJson

export default { postJson, post }
