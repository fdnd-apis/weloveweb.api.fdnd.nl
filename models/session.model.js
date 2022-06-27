const db = require('./db')
const helper = require('./helper')

/**
 * Constructor for new sessions that checks if the passed object adheres the
 * format we need and throws errors if it doesn't
 * @param {*} session an object containing the necessary fields to make a new session
 */
const session = function (session) {
  // TODO: Check for sanity...
  this.sessionId = session.sessionId
  this.title = session.title
  this.speaker = session.speaker
  this.datetime = session.datetime
  this.location = session.location
  this.short_description = session.short_description
  this.description = session.description
  this.link = session.link

}

/**
 * Get all sessions from the database, will be paginated if the number of
 * sessions in the database exceeds process.env.LIST_PER_PAGE
 * @param {*} page the page of authors you want to get
 * @returns
 */
session.get = async function (page = 1) {
  const rows = await db.query(`SELECT * FROM session LIMIT ?,?`, [
    helper.getOffset(page, process.env.LIST_PER_PAGE),
    Number(process.env.LIST_PER_PAGE),
  ])

  return {
    data: helper.emptyOrRows(rows),
    meta: { page },
  }
}

/**
 *
 * @param {*} sessionId
 * @returns
 */
session.getById = async function (sessionId) {
  const rows = await db.query(`SELECT * FROM session WHERE sessionId = ?`, [sessionId])
  return {
    data: helper.emptyOrRows(rows),
    meta: { page },
  }
}

/**
 * Add a new session to the database
 * @param {*} session a new session object created with the session constructor
 * @returns an object containing the inserted session with the newly inserted sessionId
 */
session.post = async function (session) {
  const rows = await db.query(
    `INSERT INTO session SET ${prepareQuery(session)}`,
    prepareParams(session)
  )
  session.sessionId = rows.insertId
  return {
    data: [session],
    meta: {
      insertId: rows.insertId,
    },
  }
}

/**
 *
 * @param {*} session
 * @returns
 */
session.patch = async function (session) {
  const rows = await db.query(
    `UPDATE session SET ${prepareQuery(session)} WHERE sessionId = ?`,
    prepareParams(session)
  )
  return {
    data: helper.emptyOrRows(rows),
    meta: {},
  }
}

/**
 *
 * @param {*} session
 * @returns
 */
session.put = async function (session) {
  const rows = await db.query(
    `UPDATE session SET ${prepareQuery(session)} WHERE sessionId = ?`,
    prepareParams(session)
  )
  return {
    data: helper.emptyOrRows(rows),
    meta: {},
  }
}

/**
 *
 * @param {*} sessionId
 * @returns
 */
session.delete = async function (sessionId) {
  const rows = await db.query(`DELETE FROM session WHERE sessionId = ?`, [sessionId])
  return {
    data: helper.emptyOrRows(rows),
    meta: {},
  }
}

module.exports = session

/**
 * Prepares part of an SQL query based on a passed partial session object
 * @param {*} session partial session object containing at least the sessionId
 * @returns a string to be used in the patch query, eg 'field = ?, field2 = ? ...'
 */
function prepareQuery(session) {
  return Object.keys(session)
    .filter((field) => field != 'sessionId')
    .map((field) => `${field} = ?`)
    .reduce((prev, curr) => `${prev}, ${curr}`)
}

/**
 * Prepares a passed partial session object for querying the database. Whatever
 * fields are passed, the sessionId needs to be at the end.
 * @param {*} session partial session object containing at least the sessionId
 * @returns [] an array to be used in the patch query
 */
function prepareParams(session) {
  const { sessionId, ...preparedExample } = session
  return [...Object.values(preparedExample), sessionId]
}
