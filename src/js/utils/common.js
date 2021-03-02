  /**
   * 获得每一个位置的周围9个位置的索引，组合成数组返回
   * @param {Number} location 当前位置
   * @param {Number} blocks 总方块数
   * @param {Number} col  总列数
   */
  export default function getLocationAround(location, blocks, col) {
    let aroundArr = [location];
    if (location === 0) {
      // 左上角
      aroundArr.push(
        ...[location + 1, location + col, location + col + 1]
      );
    } else if (location === col - 1) {
      // 右上角
      aroundArr.push(
        ...[location - 1, location + col, location + col - 1]
      );
    } else if (location === blocks - col) {
      // 左下角
      aroundArr.push(
        ...[location + 1, location - col, location - col + 1]
      );
    } else if (location === blocks - 1) {
      // 右下角
      aroundArr.push(
        ...[location - 1, location - col, location - col - 1]
      );
    } else if (location > 0 && location < col - 1) {
      //顶边
      aroundArr.push(
        ...[
          location - 1,
          location + 1,
          location + col,
          location + col - 1,
          location + col + 1,
        ]
      );
    } else if (
      location > blocks - col &&
      location < blocks - 1
    ) {
      //底边
      aroundArr.push(
        ...[
          location - 1,
          location + 1,
          location - col,
          location - col - 1,
          location - col + 1,
        ]
      );
    } else if (location % col === 0) {
      //左边
      aroundArr.push(
        ...[
          location + 1,
          location - col,
          location - col + 1,
          location + col,
          location + col + 1,
        ]
      );
    } else if ((location + 1) % col === 0) {
      //右边
      aroundArr.push(
        ...[
          location - 1,
          location - col,
          location - col - 1,
          location + col,
          location + col - 1,
        ]
      );
    } else {
      //中间
      aroundArr.push(
        ...[
          location - 1,
          location + 1,
          location + col,
          location - col,
          location - col - 1,
          location - col + 1,
          location + col - 1,
          location + col + 1,
        ]
      );
    }
    return aroundArr;
  }
