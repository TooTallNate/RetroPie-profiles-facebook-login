/**
 * `RetroPie-Profiles` Login Server implementing Facebook Login authentication.
 */

const qs = require('querystring')
const fetch = require('node-fetch')
const { parse, format } = require('url')
const { Redirect } = require('n8-server')
const debug = require('debug')('RetroPie-profiles-facebook-login')

const client_id = process.env.FACEBOOK_CLIENT_ID
const client_secret = process.env.FACEBOOK_CLIENT_SECRET;
const redirect_uri = process.env.FACEBOOK_REDIRECT_URI

if (!client_id || !client_secret || !redirect_uri) {
  console.error('`FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET` and `FACEBOOK_REDIRECT_URI` env vars must be defined!')
  process.exit(1)
}

module.exports = async function (req, res) {
  const parsed = parse(req.url, true)

  if ('/callback' === parsed.pathname) {
    // Facebook OAuth dialog callback
    if (parsed.query.error) {
      throw new OAuthError(parsed.query.error)
    }

    const login = await facebookLogin(parsed.query.code, {
      client_id,
      client_secret,
      redirect_uri
    })
    debug('login: %o', login)

    const r = await fbreq('/me', login.access_token)
    const me = await r.json()
    debug('me: %o', me)

    // the object passed in will be converted to env variables
    // that the login script uses.
    // `id` and `name` are required properties!
    res.emit('login', me)

    res.setHeader('Content-Type', 'text/plain; charset=utf8')
    return `Logged in as ${me.name}. Play 🕹`

  } else {
    // otherwise initiate the Facebook Login flow
    const url = facebookOAuthDialogURL({
      client_id,
      redirect_uri
    })
    throw new Redirect(url)
  }
}

function facebookOAuthDialogURL(query) {
  const parsed = parse('https://www.facebook.com/v2.7/dialog/oauth')
  parsed.query = query
  const url = format(parsed)
  debug('facebook login dialog URL: %o', url)
  return url
}

async function facebookLogin(code, params) {
  const query = Object.assign({ code }, params)
  const url = `https://graph.facebook.com/v2.7/oauth/access_token?${ qs.stringify(query) }`
  debug('facebook access token URL: %o', url)

  const res = await fetch(url)
  const body = await res.json()
  if (body.error) {
    throw new OAuthError(body.error)
  } else {
    return body
  }
}

function fbreq(path, access_token, ...extras) {
  const query = { access_token }
  const url = `https://graph.facebook.com/v2.7${path}?${ qs.stringify(query) }`
  debug('facebook request %o', path)
  return fetch(url, ...extras)
}

class OAuthError extends Error {
  constructor(err) {
    super()
    this.name = err.type
    Object.assign(this, err)
  }
}
