import dns from 'dns';
import mongoose from 'mongoose';

// mongodb+srv:// URIs require a DNS SRV lookup. On some machines (notably
// Windows behind a VPN/virtual adapter) Node's resolver fails that lookup
// against the OS's default nameserver even though the OS itself resolves it
// fine. Forcing a public resolver for SRV-based URIs avoids that failure.
function useReliableDnsForSrv(uri) {
  if (uri.startsWith('mongodb+srv://')) {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  }
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }
  useReliableDnsForSrv(uri);
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log('MongoDB connected');
}
