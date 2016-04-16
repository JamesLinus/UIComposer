# ACL UI

A library for standard ACL UI components built on top of Foundation framework. [Visit the ACL Style Guide here](http://styleguide.aclgrc.com).

## Table of Contents
- [CSS Coding Guidelines](#css-coding-guidelines)
  - [1. Coding Styles](#1-coding-style)
  - [2. Naming Convention](#2-naming-convention)
  - [3. Writing Sass](#3-writing-sass)
- [HTML Coding Guidelines](#html-coding-guidelines)
- [Installation](#installation)
  - [1. Rails App](#1-rails-app-1)
  - [2. Non-rails App](#2-non-rails-app-1)
  - [3. Pre-compiled Assets](#3-pre-compiled-assets)
- [Usage](#usage)
  - [1. Rails App](#1-rails-app)
  - [2. Non-rails App](#2-non-rails-app)
  - [3. Miscellaneous](#3-miscellaneous)
- [Caution](#caution)
- [How to Update](#how-to-update)
  - [1. In `acl-ui` Repo](#1-in-acl-ui-repo)
  - [2. In `styles-guide` Repo](#2-in-styles-guide-repo)
- [How to Add a New Icon](#how-to-add-a-new-icon-to-acl-icon-font)
- [Potential Issues](#potential-issues-and-how-to-deal-with-them)
- [Major Changelog](#major-changelog)

## CSS Coding Guidelines
#### 1. Coding Style
- We have a cssComb config in the git repos that will take care of code formatting, ~~please run cssComb before committing.~~ _We are working on a better CSS linting tool._
- Use spaces for indentation.
- Configure your editor to remove trailing white spaces.
- Be generous with comments so that your code is readable to others. Use the following comment styles:
  ```
  // ------------------------------------
  // Block comment
  // ------------------------------------
  ```
  and

  ```
  // Line comment
  ```
- Don't nest CSS rules deeper than three levels.
- Don't use `!important` unless you know exactly what you are getting into.
- Don't over-qualify selector in styling, i.e. `ul.pagination { }`
- Avoid css attribute selector, with the current exception of icon font, because selector like `[class^="acl-"]` could crash the browser if being used too often.

#### 2. Naming Convention
+ We recently started to follow BEM naming convention. So there are inconsistencies in legacy code, and those will be addressed in the near future. If you are new to BEM, [read this article](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/). Here is a short version of it:
  ```
  .block-name__element-name--modifier-name
  .block-name--modifier-name

  For example:
  .header
  .header__login--small
  .header--dark  
  ```
  + Use hyphen `-` to separate words.
  + Use a pair of double underscores `__` to separate a block from an element.
  + Use a pair of double hyphens `--` to separate a block/element from a modifier.
+ From time to time, you may run into a situation, where there are multi-level nested elements. When that is the case, you can flatten CSS structure, instead of strictly following DOM's nesting structure. Consider the following example:

  ```
  Markup structure:
    .signup
      .content
        .heading
        .form
        .footer
  CSS:
    .signup__content {…}
    .signup__content-heading {…}
    .signup__content-form {…}
    .signup__content-footer {…}
  ```
+ Use underscore `_` in IDs to separate words. Or even better, don't use ID.
+ Use IDs, html5 `data-*` attributes, or `js-` prefix classes in JavaScript calls.
+ Don't use IDs and `js-` prefixed classes for styling.

#### 3. Writing Sass
We use Sass (SCSS format) in our code base. There are a few guidelines to keep the output code concise:
- Know when to use mixins vs. placeholders. Use mixins **only if** you need to provide argument in order to get the results. Consider the following example. It is an over-simplified mixin we have in one of our apps.

  ```
  @mixin color-classes-generator($color, $name) {
    …
    background: $color;
    &:before {
      content: "$#{$name}";
    }
    …
  }
  ```
  Here is a good example of placeholder class usage:
  ```
  %standard-element {
    font-size: 1rem
    margin: 1rem;
    padding: 2rem;
    position: relative;
  }

  .signup {
    @extend %standard-element;
  }

  .promo {
    @extend %standard-element;
  }

  Output:
  .signup, .promo {
    font-size: 1rem
    margin: 1rem;
    padding: 2rem;
    position: relative;
  }
  ```
- Don't overuse parent selector(`&`) when following BEM convention. It will make it hard to search your code base later on. See an example below:

  ```
  .signup {
    signup__content {…}
    signup__content-heading {…}
    signup__content-form {…}
    signup__content-footer {…}
  }
  ```
  Consider the following **BAD** example:

  ```
  .signup {
    &__content {…}
    &__content-heading {…}
    &__content-form {…}
    &__content-footer {…}
  }
  ```
  Sure the code looks more concise than in the previous example, but later on, searching for `signup__content-form` (class name is copied from devtool) throughout the code base will not return any result.

## HTML Coding Guidelines
- When adding css class names to markup, consider the following order: custom class names come first, framework class names come after

  ```
  .signup.signup__heading.signup__heading--light.small-9.columns.hide-for-large
  ```
  The benefits of above convention is that you can quickly tell what an element is from looking at the markup without having to skip all the framework's class names.

## Installation

#### 1. Rails App
Add the following line to your application's Gemfile:

    gem 'acl-ui'

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install acl-ui

#### 2. Non-Rails App

	$ bower install https://github.com/acl-services/acl-ui.git

#### 3. Pre-compiled Assets

The minified assets (CSS and JS) are also available to use in your application. To use the pre-compiled assets, include the link to minified CSS with in the `<head>` tag, and the link to minified JS right above `</body>` tag

**CSS:** `https://s3-us-west-2.amazonaws.com/acl-ui/1.3.0/assets/css/acl-ui.min.css`

**JS:** `https://s3-us-west-2.amazonaws.com/acl-ui/1.3.0/assets/js/acl-ui.min.js`

You can change the version number ( i.e. `1.3.0`) in the URLs above, to access a previous version. Please note that we only support up to **five previous minor versions.**

## Usage

#### 1. Rails App

Include the following in your css:
```css
@import "acl-ui"
or
// require acl-ui
```

If you are using Bootstrap and only need to import part of this library.

First, include the following lines in your settings file:
```
$include-html-classes: false;
$include-html-global-classes: $include-html-classes;
```
Then add the following to import selected components:
```
@import "acl-ui-base";
@import "partials/COMPONENT_NAME";
```
See `vendor/assets/partials/` for all importable components. Form possibly is a tricky one at the moment as its styles are also applicable to generic tags, and may be conflicting with other libraries.

#### 2. Non-Rails App

Originally, acl-ui was developed as a Ruby gem for Rails applications. To use this library as a Bower component, you will need to:

##### a. Add a `settings.scss` file with the following:
```
$asset-pipeline: false;
$font-path: 'assets/fonts';
```
Change `$font-path`, if needed, so that it works for your assets folder location.

##### b. In your project's .scss file include:
```
@import 'settings.scss'
@import bower_components/acl-ui/vendor/assets/stylesheets/acl-ui.css.scss
```

##### c. Important:
* In order to compile successfully you will also need to tell the sass compiler where to find foundation. This can be done by passing the path to foundation an option when calling the compiler.

* With `$font-path` set in `settings.sass` above, you also need to include `assets/fonts/acl-icon-font` in your build process

The following is an example how to include font in build process was done in ScriptHub using gulp.
```
gulp.task('build-fonts', ['clean'], function() {
  return gulp.src('bower_components/acl-ui/app/assets/fonts/acl-icon-font*')
    .pipe(gulp.dest(config.build + "/assets/fonts"));
});
```


*i. With node-sass, that option is `includePath`*
Eg: `cmd.exe node_modules/.bin/node-sass.cmd --include-path ../../bower_components/foundation/scss styles.css.scss`


*ii. With rsass, that option is `loadPath`*

The following is an example how ScriptHub compiles assets using gulp.
```
gulp.task('build-css-dev', ['clean', 'build-vendor-dev'], function() {
  return es.merge(
    gulp.src(['assets/app/app.scss'])
      .pipe(rsass({
        loadPath: ['bower_components/bower-foundation/scss/']
      }))
});
```

#### 3. Miscellaneous
##### a. Custom Font
We use Lato font in our application UI. And it is loaded from Google CDN, by default. However, if your project is to build an off-line app and does not require an Internet connection, you can opt-out by adding the following to your `settings.scss`
```
$load-custom-font: false;
```

## Caution

As acl-ui is being used in many applications, after making a change, make sure to visually verify the change in the following apps:

1. Style Guide (Uses entire Ruby gem).
2. Launchpad (Uses entire Ruby gem).
3. ScriptHub (Uses entire Bower component).
4. Visualizer (Uses part of Bower component).
5. Project Manager (Uses part of Ruby gem).
6. Off-line Project Manager (Use entire Bower component).
7. Results Manager (Uses part of Ruby gem).

If you are unable to verify the change, please let the respective developers and QAs know.

## How to Update

Normally, updating the `acl-ui` also involves work in the `styles-guide` repo. Follow the steps below to make sure you can verify your changes.

#### 1. In `acl-ui` Repo

##### a. General update procedure

    ! Important: Do not modify bower.json, packages.json and version.rb directly.
    Those are generated by the templates in source/templates directory

1. Make design/visual updates to the styleguide Sketch file (`Box Sync/Product Design Team Folder/Design/Branding/Product Style Guide/styleguide vXX.sketch` - _where vXX is the latest version number_)
2. Checkout the repo.
2. Change into the newly created directory (`cd ~/src/acl-ui`)
3. Install the required Node and Bower modules (`npm install && bower install`)
4. Create a feature branch for your updates (`git checkout -b my-new-feature`).   
5. **Increase version number** in `gulpfile.js`, then run `gulp` We use the following version number convention: `major.minor.patch`.
6. Commit your changes (`git commit -am 'Add some feature'`).
7. Push to github (`git push origin my-new-feature`).
8. Create a pull request.

##### b. Update color palette

We share color palette with JavaScript, mostly for using in chart, therefore all colors are in `vendor/assets/shared/base-colors.json`. In order to update a color, you will need to update the json file then run `gulp` to make sure color variables will also be available in sass format.

#### 2. In `styles-guide` Repo

1. Create a feature branch with the same name as above.
2. Update path to acl-ui gem:
	- Comment out line: `gem 'acl-ui', git: 'https://...`
	- Uncomment line:  `gem 'acl-ui', path: '../acl-ui'`
4. Do the following sequence `rm -rf tmp/cache`, `bundle` and restart web server
5. After reviewing your changes, undo step 2.
6. Provided you have completed step 5 (from acl-ui repo), run `bundle update --source acl-ui`
7. **Make sure no other apps are broken.** See **Caution** section above for a list of apps need to be checked.
8. Commit your changes (`git commit -am 'Add some feature'`).
9. Push to the branch (`git push origin my-new-feature`).
10. Create a new pull request.

## How to Add a New Icon to acl-icon-font
Icon font set has grown so much since its inception, so we have moved icon font into its own entity. https://github.com/acl-services/acl-icon-font. Please see `acl-icon-font` readme for details. 

To get latest icons updates, in `acl-ui` repo do:
```
1. bower install
2. gulp get-fontstatic
3. check in the changes to git.
```

## Potential Issues and How to Deal with Them
#### 1. Lato Font Is Not Loaded

Because we are loading Lato font from Google CDN, sometimes there may be an issue with **Content-Security-Policy** header, which the server will prevent the font from being loaded. When that happen there are **several** ways to resolve:

1. Add a `<meta>` tag to your layout template's header with `Content-Security-Policy` with the following content:
`default-src 'self'; font-src http://fonts.gstatic.com; style-src 'self' 'unsafe-inline' http://fonts.googleapis.com`
2. Similar to the above, but the changes can be done to nginx server configuration.
3. Add `$load-custom-font: false;` to your .scss and add the following to your layout template's header: `<link href='http://fonts.googleapis.com/css?family=Lato:300,400,700,400italic' rel='stylesheet' type='text/css'>`

#### 2. Tests Using PhantomJS Are Failing
PhantomJS doesn't support custom font being loaded from a CDN very well. If it is the case you can turn off Lato font in test environment by setting `$load-custom-font: false` before loading acl-ui.

## Major Changelog
* Icon font is spun off to `acl-icon-font`.
* Update Foundation gem to 5.5.0, to match with that of Bower component. **This requires Sass 3.3 or newer.**
* Add Lato font, allow its loading to be configurable via variable. Bump up to version 1, and follow `major.minor.patch` convention
* Remove breadcrumb, keystrokes, magellan, orbit, range-slider, side-nav, sub-nav, switch, thumb, offcanvas from Foundation to reduce css bloat.
