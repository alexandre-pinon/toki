import { View } from "react-native";
import Svg, { G, Path } from "react-native-svg";

export const ArrowTopBottomIcon = ({
  color,
  size,
  direction = "up",
}: {
  color: string;
  size: number;
  direction?: "up" | "down";
}) => {
  const rotation = direction === "down" ? "180deg" : "0deg";
  return (
    <View style={{ transform: [{ rotate: rotation }], width: size, height: size }}>
      <Svg
        width={size}
        height={size}
        viewBox="0 0 512.000000 512.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <G
          transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
          fill={color}
          stroke="none"
        >
          <Path d="M2371 5110 c-626 -52 -1179 -307 -1616 -745 -347 -346 -586 -779-689 -1245 -80 -365 -80 -755 0 -1120 191 -864 846 -1589 1689 -1865 274 -90 511 -128 805 -128 693 0 1315 258 1805 748 407 405 654 908 731 1485 22 167 22 473 0 640 -77 578 -323 1077 -731 1486 -402 403 -913 656 -1475 728 -150 20 -388 27 -519 16z m304 -918 c24 -12 279 -260 641 -624 670 -671 642 -637 632 -763 -12 -140 -114 -234 -258 -234 -101 -1 -115 10 -507 402 l-363 361 -2-1124 -3-1125 -27-47 c-92-156-284-183-409-58-84 84-79 6-79 1254 l0 1101 -362-362 c-397-396-405-403-513-403 -144 0 -255 111 -255 254 0 115 -10 103 651 762 512 510 611 604 649 618 59 21 153 15 205-12z" />
        </G>
      </Svg>
    </View>
  );
};
