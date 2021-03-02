# Mine-Sweeper Project

> This is A Web H5 Game Program For Mine Sweeper Writed By JavaScript.

> Build with webpack

# Preview
This project includes a basic web-side minesweeper game with three levels of difficulty.

![MINE-BOOM.png](https://raw.githubusercontent.com/33YANG/Mine-Sweeper/main/preview/BOOM.png)

There is an automatic minesweeping mode (each step can be delayed by 1s), but automatic minesweeping is not absolutely correct, it is also a probability event. There is a debug mode in the automatic mode, which allows you to see clearly the operation of each step of the computer.

There is also a cyclic automatic minesweeping mode, where the computer constantly tries to sweep mines to obtain the ratio between the success and failure of mine sweeping.

![MINE-LOOP.png](https://raw.githubusercontent.com/33YANG/Mine-Sweeper/main/preview/LOOP.png)

The minesweeper probability chart of this automatic minesweeper program is provided.

![MINE-CHART.png](https://raw.githubusercontent.com/33YANG/Mine-Sweeper/main/preview/CHART.png)


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
