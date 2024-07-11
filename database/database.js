/**
 * @typedef {Object} SQLiteDatabase
 * @property {(sql: string) => Promise<void>} execAsync
 * @property {(sql: string, ...args: any[]) => Promise<void>} runAsync
 * @property {<T>(sql: string) => Promise<T>} getFirstAsync
 * @property {<T>(sql: string) => Promise<T[]>} getAllAsync
 */

/**
 * @param {SQLiteDatabase} db
 * @returns {Promise<void>}
 */

export const migrateDbIfNeeded = async (db) => {
  const DATABASE_VERSION = 5
  let { user_version: currentDbVersion } = await db.getFirstAsync('PRAGMA user_version')

  // Exit if there isn't an update
  if (currentDbVersion >= DATABASE_VERSION) return

  if (currentDbVersion === 0) {
    await db.execAsync(`
      CREATE TABLE vehicles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plate TEXT NOT NULL,
        type TEXT,
        entryYear INTEGER,
        entryMonth INTEGER,
        entryDay INTEGER,
        entryHour INTEGER,
        entryMinute INTEGER,
        observations TEXT,
        hasExited INTEGER,
        exitYear INTEGER,
        exitMonth INTEGER,
        exitDay INTEGER,
        exitHour INTEGER,
        exitMinute INTEGER
      )  
    `)
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`)
    currentDbVersion = 1
  }

  if (currentDbVersion === 1) {
    await db.execAsync(`ALTER TABLE vehicles ADD priceMinute REAL`);
    await db.execAsync(`ALTER TABLE vehicles ADD minutesStayed INTEGER`);
    await db.execAsync(`ALTER TABLE vehicles ADD subtotal REAL`);
    await db.execAsync(`ALTER TABLE vehicles ADD taxesPercentage REAL`);
    await db.execAsync(`ALTER TABLE vehicles ADD taxesAmount REAL`);
    await db.execAsync(`ALTER TABLE vehicles ADD total REAL`);
    
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`)
    currentDbVersion = 2
  }

  if (currentDbVersion === 2) {
    await db.execAsync(`ALTER TABLE vehicles ADD entryMonthText TEXT`)
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`)
    currentDbVersion = 3
  }

  if (currentDbVersion === 3) {
    await db.execAsync(`ALTER TABLE vehicles ADD exitMonthText TEXT`)
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`)
    currentDbVersion = 4
  }

  if (currentDbVersion === 4) {
    await db.execAsync(`CREATE TABLE settings(
      key TEXT,
      value TEXT
    )`)
    await db.runAsync(`INSERT INTO settings (key, value) VALUES ('priceMinute', ' 16')`)
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`)
    currentDbVersion = 5
  }
}