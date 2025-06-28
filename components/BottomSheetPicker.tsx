import { Picker } from "@react-native-picker/picker";
import { useEffect, useRef } from "react";
import { Animated, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { usePickerAnimation } from "../hooks/use-picker-animation";
import { colors, typography } from "../theme";

type Option = { label: string; value: string };
type Props = {
  visible: boolean;
  title: string;
  options: Option[];
  selectedValue?: string;
  previousValue?: string;
  onSelect: (value?: string) => void;
  onClose: () => void;
};

export function BottomSheetPicker({
  visible,
  title,
  options,
  selectedValue,
  previousValue,
  onSelect,
  onClose,
}: Props) {
  const { fadeAnim, slideAnim, showAnimation, hideAnimation } = usePickerAnimation();
  const isVisible = useRef(visible);

  useEffect(() => {
    if (visible === isVisible.current) {
      return;
    }

    visible ? showAnimation() : hideAnimation(onClose);
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
              <TouchableOpacity
                style={styles.pickerDoneButton}
                onPress={() => hideAnimation(onClose)}
              >
                <Text style={[typography.body, { color: colors.primary }]}>OK</Text>
              </TouchableOpacity>
            </View>
            <Picker
              selectedValue={selectedValue}
              onValueChange={onSelect}
              style={styles.picker}
              itemStyle={styles.pickerItem}
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
  pickerCancelButton: {
    width: 80,
  },
  pickerDoneButton: {
    width: 80,
    alignItems: "flex-end",
  },
  picker: {
    height: 200,
  },
  pickerItem: {
    ...typography.body,
  },
});
