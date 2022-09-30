# Library template

This project was bootstraped with Yarn 2. Please, refer to their [migration guide](https://yarnpkg.com/getting-started/migration) if something goes south.

## Configurint _Babel_

This project is build only as [ESModule](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/); to keep our bundled code as clean as possible, I try to use the latest possible ECMAScript version as target. That mean, if you have to support browsers that don't support certain modern ECMAScript features, you may want to configure your build tools accordingly. Here's an example for Babel:

```js
// babel.config.js
const path = require('path');
module.exports {
  include: [
    ...,
    path.resolve('node_modules/@welingtonms/library'),
  ],
  ...
}
```
