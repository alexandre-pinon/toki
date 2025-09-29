import { usePickerAnimation } from "@/hooks/use-picker-animation";
import { colors, typography } from "@/theme";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useRef } from "react";
import { Animated, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Option = { label: string; value: string };
type Props = {
  visible: boolean;
  title: string;
  options: Option[];
  onSelect: (value?: string) => void;
  onClose: () => void;
  selectedValue?: string;
  previousValue?: string;
};

export function BottomSheetPicker({ visible, title, options, onSelect, onClose, selectedValue, previousValue }: Props) {
  const { fadeAnim, slideAnim, showAnimation, hideAnimation } = usePickerAnimation();
  const isVisible = useRef(visible);

  useEffect(() => {
    if (visible === isVisible.current) {
      return;
    }

    if (visible) {
      showAnimation();
    } else {
      hideAnimation(onClose);
    }
    isVisible.current = visible;
  }, [visible, showAnimation, hideAnimation, onClose]);

  return (
    <Modal visible={visible} transparent onRequestClose={() => hideAnimation(onClose)}>
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [300, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.pickerContent}>
            <View style={styles.pickerHeader}>
              <TouchableOpacity
                style={styles.pickerCancelButton}
                onPress={() => {
                  onSelect(previousValue);
                  hideAnimation(onClose);
                }}
              >
                <Text style={[typography.body, { color: colors.gray }]}>Annuler</Text>
              </TouchableOpacity>
              <Text style={[typography.body, styles.pickerTitle]}>{title}</Text>
              <TouchableOpacity style={styles.pickerDoneButton} onPress={() => hideAnimation(onClose)}>
                <Text style={[typography.body, { color: colors.primary }]}>OK</Text>
              </TouchableOpacity>
            </View>
            <Picker
              selectedValue={selectedValue}
              onValueChange={onSelect}
              style={styles.picker}
              itemStyle={typography.body}
            >
              {options.map((option) => (
                <Picker.Item key={option.value} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  pickerContent: {
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
  },
  pickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray300,
  },
  pickerTitle: {
    fontWeight: "600",
  },
  pickerCancelButton: {},
  pickerDoneButton: {
    paddingHorizontal: 12,
  },
  picker: {
    height: 200,
  },
});
