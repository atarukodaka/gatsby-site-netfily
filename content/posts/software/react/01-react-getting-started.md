---
title: getting started
date: 2021-02-18 00:00:00
cover: react.png
---

```html:title=index.html
<!DOCTYPE html>

<html>
    <head>
        <title>React App</title>
        <link rels="stylesheet" href="css/style.css" />
        <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/babel-standalone@6.15.0/babel.min.js"></script>
        
    </head>

    <body>  
        <script type="text/babel">
            const App = () => (
                <div>Hello</div>
            )
            ReactDOM.render(<App/>, document.querySelector('#app'))
        </script>




        <h2>React App</h2>
        <div id="app">
        </div>
    </body>
</html>
```