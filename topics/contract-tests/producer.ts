export function fetchUserFromProducer(): unknown {
  return {
    id: 'u1',
    email: 'a@example.com',
    createdAt: new Date().toISOString(),
  }
}
