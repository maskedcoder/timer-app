Timer App
=========

> In progress

Well, what would _you_ build if your Internet connection went down and you had nothing better to do?

Since the Internet was down, I couldn't (easily) do my usual build process, which involves downloading [Gulp][gulp], [Gulp Sass][gulp-sass] and [Inuit][inuit]. As a result, it's built on un-abstracted HTML, CSS, and JavaScript. Which is probably a good exercise (and works great with [Brackets'][brackets] Live Preview). I did manage to find a local copy of Inuit, so it has some of that, but not in Sass.

Also due to the Internet being down, I couldn't look up ways to cache data in the browser to achieve some sort of data persistence. I was thinking of having it be able to keep a browser-side copy of the data that would persist beyond page refreshes, and then a server-side copy (not done yet) which would outlast browser cache clearing. This way it would work for a while when the connection to the server was broken (for example, if the Internet went, um, down), and then it would sync on the next opportunity.

However, since I've never dealt with browser data persistence, I had to do a lot of poking around in the DevTools console to figure out what was available and what the API was. I settled on using [`sessionStorage`][sessionStorage] at first. When the Internet came back and I was finally able to look it up, I realized that [`localStorage`][localStorage] was a better option.

Unfortunately, as it is currently built, it requires JavaScript for everything. Ideally, one should at least be able to navigate to the other tabs. I need to fix that. Perhaps I might even be able to get the timer to not require JavaScript (though the little clock would be impossible).

TODO
----

- Give it a backend that actually stores data
- Use multiple pages or something, so that the tabs can work without JavaScript
- Add statistics in the Stats tab
- Make the History table sortable and searchable
- Make the timer work without JavaScript
- Make the timer work even if the page is refreshed while it is running
- Allow notes or tags to be given along with the title of a timer, for organization
- Add a ServiceWorker, just for thrills?

License (MIT)
-------------

Copyright (c) 2016 Andrew Myers.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[gulp]: http://gulpjs.com/
[gulp-sass]: https://www.npmjs.com/package/gulp-sass
[inuit]: https://github.com/inuitcss
[brackets]: http://brackets.io/
[sessionStorage]: https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
[localStorage]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
