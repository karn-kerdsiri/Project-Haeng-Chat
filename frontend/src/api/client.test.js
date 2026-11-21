import { getJson, postJson } from './client.js'

test('test_API_client_posts_to_requested_path', async () => {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: vi.fn().mockResolvedValue({ status: 'received' }),
  })
  globalThis.fetch = fetchMock

  const payload = { academicYear: '2568', courses: [] }
  const result = await postJson('/student/academic-records/pre-check', payload)

  expect(fetchMock).toHaveBeenCalledWith(
    '/student/academic-records/pre-check',
    expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  )
  expect(result).toEqual({ status: 'received' })
})

test('test_API_client_calls_member_endpoints', async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({
        studentId: '650710000',
        fullName: 'สมชาย ใจดี',
        department: 'เทคโนโลยีสารสนเทศ',
      }),
    })
    .mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ status: 'linked' }),
    })
  globalThis.fetch = fetchMock

  const lookup = await getJson('/api/students?studentId=650710000')
  const linked = await postJson('/api/requests/request-1/members', {
    studentId: '650710000',
  })

  expect(fetchMock).toHaveBeenNthCalledWith(
    1,
    '/api/students?studentId=650710000',
    expect.objectContaining({
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }),
  )
  expect(fetchMock).toHaveBeenNthCalledWith(
    2,
    '/api/requests/request-1/members',
    expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: '650710000' }),
    }),
  )
  expect(lookup).toEqual({
    studentId: '650710000',
    fullName: 'สมชาย ใจดี',
    department: 'เทคโนโลยีสารสนเทศ',
  })
  expect(linked).toEqual({ status: 'linked' })
})

test('test_API_client_calls_advisor_review_endpoints', async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ reviews: [] }),
    })
    .mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ review: 'mock' }),
    })
    .mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ result: 'received' }),
    })
  globalThis.fetch = fetchMock

  const decisionPayload = { sample: 'mock' }
  const reviews = await getJson('/api/advisor/reviews')
  const review = await getJson('/api/advisor/reviews/request-1')
  const decision = await postJson(
    '/api/advisor/reviews/request-1/decision',
    decisionPayload,
  )

  expect(fetchMock).toHaveBeenNthCalledWith(
    1,
    '/api/advisor/reviews',
    expect.objectContaining({
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }),
  )
  expect(fetchMock).toHaveBeenNthCalledWith(
    2,
    '/api/advisor/reviews/request-1',
    expect.objectContaining({
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }),
  )
  expect(fetchMock).toHaveBeenNthCalledWith(
    3,
    '/api/advisor/reviews/request-1/decision',
    expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(decisionPayload),
    }),
  )
  expect(reviews).toEqual({ reviews: [] })
  expect(review).toEqual({ review: 'mock' })
  expect(decision).toEqual({ result: 'received' })
})
