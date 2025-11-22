# [Unexpected Keyboard Layout Editor](https://domportera.github.io/app-unexpected-keyboard-layout-editor)

## Pull requests welcome!
I don't see myself religiously maintaining this, but pull requests for fixes/updates are more than welcome. Problems and blind spots still exist here, and I am fairly out of my depth with web development as it is. I am happy to review and accept pull requests that improve this in any way.

## Information
This is a tool for creating and editing layouts for [Unexpected Keyboard](https://github.com/Julow/Unexpected-Keyboard). Thanks a million to [Julow](https://github.com/sponsors/Julow) for this gift of a keyboard.

Forked from [lixquid's repository](https://github.com/lixquid/app-unexpected-keyboard-layout-editor), whose live site can be viewed [here](https://unexpected-keyboard-layout-editor.lixquid.com)

## How to Use

1. To get started, either:
    1. Select a layout under the *Start from a template* dropdown, or
    2. Import a layout from its XML by putting it in the *Import from XML* box and clicking *Import*.
2. Add rows by clicking the *Add Row* button, or edit / remove existing rows by clicking on the cog button on the right side of the row.
3. Add keys to rows by clicking the Plus button on the right side of the row, or edit / remove existing keys by clicking on the key itself.
4. Once you're done, click *Export to XML* to get the XML for your layout.


# Development

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

## Getting Started

1. Clone the repository
2. Install dependencies: `yarn install`
3. Start the development server: `yarn start`
4. Open http://localhost:1234 in your browser

Changes to the source files will be automatically reloaded in the browser.

## Building for Production

1. Remove the `dist` folder: `rm -rf dist`
2. Build the project: `yarn build`
3. The production files will be in the `dist` folder

## Maintenance Notes
Maintenance of this fork is not guaranteed - as I'm basically clueless about web development. I just figured this was something I could do quickly for my own sake and anyone else's. Forks or contributions are welcome!
