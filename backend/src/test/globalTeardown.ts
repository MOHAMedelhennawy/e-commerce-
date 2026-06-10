export default async function globalTeardown() {
  // Prisma client connections are released on process exit.
  // The test DB container is ephemeral and gets destroyed on teardown.
}
