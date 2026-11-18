// Smoke test for the generic application shell.
import { render } from '@testing-library/react'
import App from '../App.jsx'

test('application shell renders', () => {
  const { container } = render(<App />)
  expect(container.querySelector('main')).toBeTruthy()
})
