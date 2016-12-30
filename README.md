RetroPie-profiles-facebook-login
================================
### RetroPie-profiles Login Server using Facebook Login

This is a Login Server for the [RetroPie-profiles][profiles] plugin
backed by Facebook Login. So you can log in to your RetroPie with
your Facebook profile, which a lot of people are already logged in
to on their mobile devices.

Note that this _does not_ save your files on Facebook or in the cloud
in any way. However, you can easily set that up yourself using
something like `sshfs` for an SSH server, or maybe `s3fs` for storing save files
on Amazon S3.


Deploy
------

The first step is to determine which URL will enter for the Login Server
URL on RetroPie-profiles, as well as the URL that you will visit on your
mobile device to log in. This can either be a (sub)domain that you own, or a
free subdomain from `.now.sh` (so for example `https://nates-login-server.now.sh`).

See the [Zeit "alias" page](https://zeit.co/world#2.-alias-your-deployments) for
more details on deploying with a custom domain name.

Now that you've picked a URL, you can easily deploy your own instance without
even cloning the code:

1. Go to the [Facebook Developer](https://developers.facebook.com/apps/) page and create a new "app".
1. Make sure to enable "Facebook Login", and _add the **OAuth redirect URI**_,
   which MUST be `<login server URL>/callback`
1. [Download `now`](https://zeit.co/download).
1. Run the following command. Be sure to replace the three variables with their
   proper values from the Facebook App page!

    ```bash
    $ now TooTallNate/retropie-profiles-facebook-login \
        -e FACEBOOK_CLIENT_ID=<client id> \
        -e FACEBOOK_CLIENT_SECRET=<client secret> \
        -e FACEBOOK_REDIRECT_URI=<redirect URI>
    ```

1. You will get a new URL for the deployment. Copy that and use it in the
   `alias` command like so:

    ```bash
    $ now alias <deployment URL> <login server URL>
    ```

Now when RetroPie-profiles prompts you for the Login Server URL, entry the
callback URL that has been set up.


License
-------

(The MIT License)

Copyright (c) 2016 Nathan Rajlich &lt;n@n8.io&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[RetroPie]: https://retropie.org.uk/
[profiles]: https://github.com/TooTallNate/RetroPie-profiles
[server]: https://github.com/TooTallNate/RetroPie-profiles-server
