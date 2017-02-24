# alexa-app-root
`alexa-app-root` is a derivation of [alexa-app-server](https://github.com/alexa-js/alexa-app-server) and used to host development and testing of Alexa skills.

It presents an easy-to-use web interface to test the intents of the skills under development. It also provides output for copy/paste into the Alexa developer console for the skill's Interaction Model.

It expects all alexa skills under development to be in a folder at the same level as the root of this folder - typically called `alexa-js-apps`.

When the server is run, the apps are loaded and presented in the UI for inspection and testing.

Because this derives from [alexa-app-server](https://github.com/alexa-js/alexa-app-server), more information about configuration and running can be found visiting the github page.

## Installation
To use the server, fork or clone the [project from github](https://github.com/rickwargo/alexa-app-root). 

### Enabling HTTPS
If you have openssl installed, you can generate a self-signed certificate using:
```
gulp make-cert
```
The private key and cert files are encoded into the server, these gulp tasks generate files with names required for the server.
Following is a sample interaction to create a certificate:
```
RickPro:alexa-app-root rick$ gulp make-cert
[11:46:53] Using gulpfile ~/Code/alexa-js/alexa-app-root/gulpfile.js
[11:46:53] Starting 'make-cert'...
Generating RSA private key, 1024 bit long modulus
.....++++++
.......++++++
e is 65537 (0x10001)
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:US
State or Province Name (full name) [Some-State]:Pennsylvania
Locality Name (eg, city) []:Blue Bell
Organization Name (eg, company) [Internet Widgits Pty Ltd]:epicminds
Organizational Unit Name (eg, section) []:
Common Name (e.g. server FQDN or YOUR name) []:Rick Wargo
Email Address []:my-email-address@my-company.com
[11:47:14] Finished 'make-cert' after 21 s
```

To make sure the certificate is verified, use the following:
```
gulp check-cert
```

## Starting the Server
Start the web server by passing `--start` on the command line. The server must be started to develop/test locally. The server can also be started with:
```
npm start
```

## Usage
If planning to use HTTPS, you'll need to generate a self-signed x509 certificate for the server and place the files in `sslcert`. The gulp task `make-cert` will create the certificate for you, assuming openssl is installed. If you do create a self-signed certificate, the browser will issue a warning when browsing to a page that uses that certificate.

To test intents browse to http://localhost:8003/test or ( https://localhost:8443/test ).

## Enhancing the Base Release
### CSS Files
CSS files are developed in SCSS. Use the gulp task `scss` to turn the .sccs files into .css files.
### PUG Files
PUG (formerly Jade) is used as the HTML templating engine. The server knows how to convert to HTML and no task is necessary to perform this functionality prior to starting the server.

## Running in Production
See [alexa-app-server](https://github.com/alexa-js/alexa-app-server#user-content-running-in-production) for more details.

# History
See [CHANGELOG](CHANGELOG.md) for details.

# License
Copyright (c) 2016-2017 Rick Wargo
MIT License, see [LICENSE](LICENSE.md) for details.