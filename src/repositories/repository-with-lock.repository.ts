import stringHash from 'string-hash';
import { Repository } from 'typeorm';

export class RepositoryWithLock<T> extends Repository<T> {
  // true means that a lock was acquired, false means that it was not
  // as it is a try lock method, it will not wait for the lock to be released and will return true if the lock was already acquired by another process
  // A retry or wait mechanism can be implemented in the caller to wait for the lock to be released
  // pg_advisory_xact_lock($1) can be used to wait for a lock to be available and then acquire it (but care needs to be taken to avoid deadlocks)
  // pg_try_advisory_xact_lock is a transaction lock, so it must be used in a transaction, and will automatically be released at the end of the transaction
  async acquireLock(lockingId: string): Promise<boolean> {
    const [lock]: [{ pg_try_advisory_xact_lock: boolean }] = await this.query(
      'SELECT pg_try_advisory_xact_lock($1)',
      [stringHash(lockingId)],
    );
    return lock.pg_try_advisory_xact_lock;
  }
}
