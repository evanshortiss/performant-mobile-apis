# Building Performant Mobile APIs

As part of a series of blog posts on the [Red Hat Mobile Developer Blog](http://developers.redhat.com/blog/2016/10/31/improving-user-experience-for-mobile-apis-using-the-cloud/)
we're discussing techniques that will assist you in building a better mobile
experience through your RESTful API. This repository is a companion to those
blog posts.

This is a simple node.js application that mimics common enterprise APIs
we've seen. It communicates with an older ESB system to get jobs (perhaps via
SOAP), and then it uses a modern weather API to get weather data for each job
before finally returning them to the mobile device making the API call.
Typically in a scenario like this the ESB response time can be high, and coupled
with getting weather information it can lead to response times that are higher
than we or our end users are happy with. This application also facilitates
sending text messages via it's RESTful API.

## Prerequisites
You should install the following on your machine and use the default ports and
settings.

* node.js >= v4.4.3
* npm (will be installed with node.js)
* git
* MongoDB >= v2.4.6
* Redis >= v3.0

*NOTE: Installing Git, node.js (v4 +), npm, and mongodb is outside the scope of
this article, but it's very easy on all major platforms. Getting a Dark Sky API
key is also simple, just go to [darksky.net](https://darksky.net/dev/) and
signup for one.*

## Part 1 ([Blog Link](http://red.ht/2jyKGMB))
In the first part of these blog posts we discuss how building performant mobile
APIs is extremely important if you hope to create a mobile strategy that is
well received by your users. Should the user experience suffer due to poor API
response times users will be quick to tire of your applications and might go
as far as to uninstall them.

For an example of what slow response times look like take a look at the tag
on this repo named _part-one_. If you're not sure how to do that then try the
following from a terminal.

```
# Clone the repo locally and cd into it's directory
git clone git@github.com:evanshortiss/performant-mobile-apis.git performant-mobile-apis
cd performant-mobile-apis

# access the tag
git checkout part-one

# Install required dependencies
npm install

# Set your dark sky (weather) api key, for windows use "set" instead of "export"
export DS_API_KEY=YOUR_API_KEY

# Run the application
npm start
```

Once the application is running you can use cURL, Postman (there's a
Postman collection in this repository for convenience), or a web
browser to make a HTTP call to [http://localhost:8009/jobs](http://localhost:8009/jobs)
to get a list of jobs and their weather. It might take a while since we're
deliberately trying to demonstrate a poor user experience!

Below is a small benchmark showing the current performance of this application
for 10 concurrent requests. 22.9 seconds is a long time to spend processing 10
requests, especially requests that are such perfect candidates for optimizations
that an MBaaS solution such as Red Hat Mobile Application Platform can provide.

```
eshortis@eshortis-OSX:~$ ab -n 20 -c 10 http://localhost:8009/jobs
This is ApacheBench, Version 2.3 <$Revision: 1663405 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient).....done


Server Software:        
Server Hostname:        localhost
Server Port:            8009

Document Path:          /jobs
Document Length:        32645 bytes

Concurrency Level:      10
Time taken for tests:   22.879 seconds
Complete requests:      20
Failed requests:        13
   (Connect: 0, Receive: 0, Length: 13, Exceptions: 0)
Total transferred:      658249 bytes
HTML transferred:       652883 bytes
Requests per second:    0.87 [#/sec] (mean)
Time per request:       11439.426 [ms] (mean)
Time per request:       1143.943 [ms] (mean, across all concurrent requests)
Transfer rate:          28.10 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.1      0       1
Processing:  6661 8740 1620.1   8471   11759
Waiting:     6661 8740 1620.1   8471   11759
Total:       6661 8740 1620.2   8471   11760

Percentage of the requests served within a certain time (ms)
  50%   8471
  66%   9859
  75%  10280
  80%  10533
  90%  11118
  95%  11760
  98%  11760
  99%  11760
 100%  11760 (longest request)
```

In each part of this series we will be updating this codebase with optimizations
to improve the performance of this API and get those numbers much lower.

## Part 2 ([Blog Link](http://red.ht/2k1G8Lo))
In part two of the blog series we aim to reduce the volume of data transmitted
between the client and server since this will shorten request times on slow
connections, reduce the mobile data usage, and drain less battery.

To view the code for part two simply perform a `git fetch origin` and follow
the steps outlined in part one, but instead change the `git checkout` to use
`part-two`.

If you'd like to see the small changes we made between the original codebase and
part two just run `git diff part-one..part-two`. These changes can reduce
bandwidth usage of this app by up to 95% depending on the structure of the data!

## Part 3
In part 3 we aimed to reduce request processing time. Reducing processing time
improves user experience since your application will feel faster and it can also
reduce battery usage since a connection does not need to be kept open for as
long.

We also utilised the cache-control header to ensure clients that needed the same
resources frequently would use a locally cached copy for a time period defined
by the express application.

To view the code for part three simply perform a `git fetch origin` and follow
the steps outlined in part one, but instead change the `git checkout` to use
`part-three`.
