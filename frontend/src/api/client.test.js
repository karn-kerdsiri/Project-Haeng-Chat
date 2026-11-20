import { postJson } from './client.js'

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
