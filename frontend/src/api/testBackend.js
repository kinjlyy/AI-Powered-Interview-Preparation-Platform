export async function testBackend() {
  const response = await fetch('/api/test');
  if (!response.ok) {
    throw new Error('Failed to reach backend');
  }

  return response.json();
}



