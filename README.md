# G+ Profile Excercise

This is a repository for [perttu-2-gapps.appspot.com](http://perttu-2-gapps.appspot.com)

## Back-end

**Package:** com.perttu.gplus

**Startpoint for backend:** https://github.com/googleplus/gplus-quickstart-java

**Main modifications / Additions:**
- separating the single Signin.java to multiple servlets.
- UTILS as separate class
- Added profileservlet based on people servlet

**Future improvements:**
- More APIs, more APIs, more APIs...

## Front-end

**Technologies:**
- Angular
- CSS3 magic
- SCSS
- No jQuery or similar
- Mobile First Responsive design
- npm, Bower and Gulp for smooth workflow

**Icons:**

Note on icons: I decided to use [Icomoon](https://icomoon.io/) and their icons in contrary to designing my own. However if I would have designed my own, I still would have converted them to icon font through Icomoon. There is no fallback provided, the usage of icons is not crucial for the UX/UI. Android 2.3 and Opera mini have partial support. SVGs or PNGs could be provided as a fallback if necessary.

**Future improvements:**
- Elegant design to adapt to small cover photo...
- There is always room for improving the design
- Fallbacks for icons
- More finished design
- Auto Login, so the logout button doesn't break after reloading the page (this is due auth token and code being missing...)
- TESTS!!
