# Mine-Sweeper Project

> This is A Web H5 Game Program For Mine Sweeper Writed By JavaScript.

> Build with webpack

# Preview
This project includes a basic web-side **minesweeper game** with 3 levels of difficulty.

![MINE-BOOM.PNG](https://raw.githubusercontent.com/33YANG/Mine-Sweeper/main/preview/BOOM.PNG)

There is an automatic minesweeping mode (each step can be delayed by 1s), and a debug mode in the automatic mode, which allows you to see clearly the operation of each step of the computer.

And a cyclic automatic minesweeping mode, where the computer constantly tries to sweep mines to obtain the ratio between the success and failure of mine sweeping.

![MINE-LOOP.PNG](https://raw.githubusercontent.com/33YANG/Mine-Sweeper/main/preview/LOOP.PNG)

The minesweeper probability chart of this automatic minesweeper program is provided.

![MINE-CHART.PNG](https://raw.githubusercontent.com/33YANG/Mine-Sweeper/main/preview/CHART.PNG)


# Start

```bash
yarn
```

## Build for production

```bash
yarn build
```
When build completed, open `dist/index.html` in broswer, or try:

```bash
yarn global add http-server && http-server dist
```

you will get a local http server, open the server site to check the build result.


## Start at devolepment

```bash
yarn start
```

You will get a live-reload devolepment env about js&less files

# License

[MIT](./LICENSE)
