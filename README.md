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

You can easily deploy your own instance without even cloning the code.
Make sure you have [now][] installed.

 1. Go to the Facebook Developer page and create a new "app".
 1. Make sure to enable "Facebook Login", and add a callback URL that you would
    like to use.
 1. ```bash
    $ now TooTallNate/retropie-profiles-facebook-login`
    ```
 1. You will get a new URL for the deployment. Copy that and use it in the `alias`
    command like so:
    ```bash
    $ now alias <deployment URL> <callback URL>
    ```

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
