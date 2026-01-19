import { Linking, Text, StyleProp, TextStyle } from "react-native";
import { parseTextWithLinks } from "@/utils/string";
import { colors } from "@/theme";

type LinkableTextProps = {
  children: string;
  style?: StyleProp<TextStyle>;
  linkStyle?: StyleProp<TextStyle>;
};

export function LinkableText({
  children,
  style,
  linkStyle,
}: LinkableTextProps) {
  const segments = parseTextWithLinks(children);

  const handleLinkPress = async (url: string) => {
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      return;
    }
    await Linking.openURL(url);
  };

  const defaultLinkStyle: TextStyle = {
    color: colors.primary,
    textDecorationLine: "underline",
  };

  return (
    <Text style={style}>
      {segments.map((segment, index) =>
        segment.type === "link" ? (
          <Text
            key={index}
            style={[defaultLinkStyle, linkStyle]}
            onPress={() => handleLinkPress(segment.url)}
            accessibilityRole="link"
            accessibilityHint="Ouvrir dans le navigateur"
          >
            {segment.content}
          </Text>
        ) : (
          <Text key={index}>{segment.content}</Text>
        ),
      )}
    </Text>
  );
}
