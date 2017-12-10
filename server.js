/**
 * `RetroPie-Profiles` Login Server implementing Facebook Login authentication.
 */

const qs = require('querystring')
const fetch = require('node-fetch')
const { parse, format } = require('url')
const retropieProfiles = require('retropie-profiles-server')
const debug = require('debug')('RetroPie-profiles-facebook-login')

const client_id = process.env.FACEBOOK_CLIENT_ID
const client_secret = process.env.FACEBOOK_CLIENT_SECRET

let redirect_uri = process.env.FACEBOOK_REDIRECT_URI || process.env.NOW_URL

if (!client_id || !client_secret || !redirect_uri) {
  console.error(
    '`FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET` and `FACEBOOK_REDIRECT_URI` env vars must be defined!'
  )
  process.exit(1)
}

redirect_uri = parse(redirect_uri)
redirect_uri.pathname = '/callback'
redirect_uri = format(redirect_uri)

console.log(
  'Please ensure that %j is a whitelisted Callback URL in your Facebook App settings!',
  redirect_uri
)

module.exports = retropieProfiles(async function(req, res, login) {
  const parsed = parse(req.url, true)

  if ('/callback' === parsed.pathname) {
    // Facebook OAuth dialog callback
    if (parsed.query.error) {
      throw new OAuthError(parsed.query.error)
    }

    const auth = await facebookLogin(parsed.query.code, {
      client_id,
      client_secret,
      redirect_uri
    })
    debug('auth: %o', auth)

    const r = await fbreq('/me', auth.access_token)
    const me = await r.json()
    debug('me: %o', me)

    // the object passed in will be converted to env variables
    // that the login script uses.
    // `id` and `name` are required properties!
    const hosts = login(me)

    res.setHeader('Content-Type', 'text/plain; charset=utf8')
    return `Logged in as ${me.name} on ${hosts.join(', ')}. Play 🕹`
  } else {
    // otherwise initiate the Facebook Login flow
    const url = facebookOAuthDialogURL({
      client_id,
      redirect_uri
    })

    res.setHeader('Location', url)
    res.statusCode = 302
    res.end()
  }
})

function facebookOAuthDialogURL(query) {
  const parsed = parse('https://www.facebook.com/v2.7/dialog/oauth')
  parsed.query = query
  const url = format(parsed)
  debug('facebook login dialog URL: %o', url)
  return url
}

async function facebookLogin(code, params) {
  const query = Object.assign({ code }, params)
  const url = `https://graph.facebook.com/v2.7/oauth/access_token?${qs.stringify(
    query
  )}`
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
  const url = `https://graph.facebook.com/v2.7${path}?${qs.stringify(query)}`
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
