import styles from "./Canvas.module.css";
import { useEffect, useState } from "react";
import { colorPalette } from "./Palette";
export default function Canvas(props) {
  return (
    <div className={`${styles.wrapper}`}>
      <div className={`${styles.gameboard}`}>
        {props?.colors.map((color, index) => {
          return (
            <div
              key={index}
              style={{ backgroundColor: `${colorPalette[color]}` }}
              onClick={() => {
                props.setX(Math.floor(index / 100));
                props.setY(index % 100);
                props.setSelected(colorPalette[color]);
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
}
