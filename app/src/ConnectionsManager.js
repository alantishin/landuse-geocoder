const { Pool } = require('pg')

/**
 * Database connection
 */
class DbManager {
  constructor(params = {}) {

    this.user = null
    this.password = null
    this.host = null
    this.database = null
    this.port = 5432

    this._pool = null

    this.setOptions(params)
  }

  setOptions(params) {
    this.user = params.user
    this.password = params.password
    this.host = params.host
    this.database = params.database
    this.port = params.port || 5432
  }

  getPool() {
    if (!this._pool) {
      console.log('[_initCLient]', this.database)

      this._pool = new Pool({
        user: this.user,
        password: this.password,
        host: this.host,
        database: this.database,
        port: this.port || 5432,

        max: 100,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000
      })
    }

    return this._pool
  }

  /**
   * Запрос sql к базе
   */
  query(sql, values = null) {
    return new Promise(async (resolve, reject) => {
      let client = null

      try {
        const query = {
          text: sql,
          values: values,
        }

        client = await this.getPool().connect()
        const res = await client.query(query)
        resolve(res)
      } catch (e) {
        reject(e)
      } finally {
        if (client) {
          client.release()
        }
      }
    })
  }

  async insert(table, data) {
    return new Promise(async (resolve, reject) => {
      let client = null

      try {
        const values = Object.values(data)
        const columns = Object.keys(data).join(',')
        const valuesMask = values.reduce((accumulator, currentValue) => {
          const i = accumulator.length + 1
          accumulator.push(`$${i}`)
          return accumulator
        }, [])
          .join(',')

        const sql = `
          INSERT INTO ${table}
          (${columns}) 
          VALUES (${valuesMask})
        `;

        client = await this.getPool().connect()
        const res = await client.query(sql, values)
        resolve(res)

      } catch (e) {
        reject(e)
      } finally {
        if (client) {
          client.release()
        }
      }
    })

  }
}

const manager = new DbManager()

module.exports = manager
