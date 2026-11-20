async function requestJson(method, path, payload) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }
  if (payload !== undefined) options.body = JSON.stringify(payload)

  const response = await fetch(path, options)

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

// รองรับ FR-PRE-05 และ IF-WEB-01 / FR-GRP-02: ค้นหา Member endpoint ด้วย GET ไปยัง path ที่ผู้เรียกกำหนด
export async function getJson(path) {
  return requestJson('GET', path)
}

// รองรับ FR-PRE-05 และ IF-WEB-01 / FR-GRP-02: ส่ง POST ไปยัง Member หรือ Pre-check endpoint ที่ผู้เรียกกำหนด
export async function postJson(path, payload) {
  return requestJson('POST', path, payload)
}

export const post = postJson
export const get = getJson

export default { getJson, get, postJson, post }
